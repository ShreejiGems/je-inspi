import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PurchasedOrderCoreService } from 'src/core/purchased-order-core/purchased-order-core.service';
import { OrderItemCoreService } from 'src/core/order-item-core/order-item-core.service';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { JewelleryService } from '../jewellery/jewellery.service';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  GetPurchaseOrdersDto,
  DateFilterDto,
} from './dto/purchase-order.dto';
import {
  STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_MODE,
} from '@prisma/client';
import { CartCoreService } from 'src/core/cart-core/cart-core.service';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import * as crypto from 'crypto';
import { UserSessionType } from 'src/shared/types/user-session.type';
import { CartItemCoreService } from 'src/core/cart-item-core/cart-item-core.service';
import { CalculatorCoreService } from 'src/core/calculator-core/calculator-core.service';

const Razorpay = require('razorpay');

@Injectable()
export class PurchaseOrderService {
  private razorpay: any;

  constructor(
    private readonly purchasedOrderCoreService: PurchasedOrderCoreService,
    private readonly orderItemCoreService: OrderItemCoreService,
    private readonly prisma: PrismaService,
    private readonly jewelleryService: JewelleryService,
    private readonly cartCoreService: CartCoreService,
    private readonly cartItemCoreService: CartItemCoreService,
    private readonly calculatorCoreService: CalculatorCoreService,
  ) {
    this.razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
      ? new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        })
      : null;
  }

  async createPurchaseOrder(
    sessionData: UserSessionType,
    createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    const userId = sessionData.user.id;

    const discount = sessionData.user.discount;

    // Calculate prices for all order items
    const orderItemsWithPrices = await Promise.all(
      createPurchaseOrderDto.orderItems.map(async (item) => {
        // Convert MATERIAL enum to the format expected by calculateJewelleryPrice
        const materialMapping = {
          SILVER: 'silver',
          TEN_KT_GOLD: 'tenKtGold',
          FORTEEN_KT_GOLD: 'forteenKtGold',
          EIGHTEEN_KT_GOLD: 'eighteenKtGold',
        };

        const priceResult = await this.jewelleryService.calculateJewelleryPrice(
          {
            variantId: item.variantId,
            material: materialMapping[item.material] as
              | 'silver'
              | 'tenKtGold'
              | 'forteenKtGold'
              | 'eighteenKtGold',
            includeCertificate: item.includeCertificate,
          },
        );

        const unitPrice =
          Number(priceResult.finalPrice) -
          (Number(priceResult.finalPrice) * discount) / 100;
        const totalPrice = unitPrice * item.quantity;

        return {
          ...item,
          unitPrice,
          totalPrice,
        };
      }),
    );

    // Calculate order totals
    const subtotal = orderItemsWithPrices.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
    const tax = 0; // You can implement tax calculation logic here
    const shipping = 0; // You can implement shipping calculation logic here
    const totalAmount = subtotal + tax + shipping;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create purchase order with transaction
    return await this.prisma.prisma.$transaction(async (tx) => {
      // Create the purchase order
      const purchaseOrder = await this.purchasedOrderCoreService.create({
        data: {
          userId,
          orderNumber,
          orderDate: new Date(),
          subtotal,
          tax,
          shipping,
          totalAmount,
          orderStatus: ORDER_STATUS.PENDING,
          paymentStatus: PAYMENT_STATUS.PENDING,
          paymentMethod: createPurchaseOrderDto.paymentMethod,
          shippingAddress: createPurchaseOrderDto.shippingAddress,
          shippingCity: createPurchaseOrderDto.shippingCity,
          shippingState: createPurchaseOrderDto.shippingState,
          shippingCountry: createPurchaseOrderDto.shippingCountry,
          shippingPostalCode: createPurchaseOrderDto.shippingPostalCode,
          transactionId: createPurchaseOrderDto.transactionId,
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        orderItemsWithPrices.map(async (item) => {
          return await this.orderItemCoreService.create({
            data: {
              orderId: purchaseOrder.id,
              jewelleryId: item.jewelleryId,
              variantId: item.variantId,
              material: item.material,
              includeCertificate: item.includeCertificate,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              selectedColor: item.selectedColor,
              selectedSize: item.selectedSize,
              sku: item.sku,
            },
          });
        }),
      );

      let order;
      if (createPurchaseOrderDto.paymentMethod === PAYMENT_MODE.INSTANT) {
        let razorpayAmount = totalAmount; //in dollars

        if (createPurchaseOrderDto.checkoutCurrency === 'INR') {
          const exchangeRate = await this.calculatorCoreService.findFirst({
            where: {
              isDeleted: false,
              status: STATUS.ENABLED,
            },
          });
          razorpayAmount = razorpayAmount * exchangeRate.dollarRupeeRate;
        }

        razorpayAmount = Math.round(razorpayAmount * 100);

        const options = {
          amount: razorpayAmount,
          currency: createPurchaseOrderDto.checkoutCurrency,
          receipt: purchaseOrder.orderNumber,
          notes: {
            region:
              createPurchaseOrderDto.checkoutCurrency === 'INR'
                ? 'INDIA'
                : 'INTERNATIONAL',
          },
        };

        if (!this.razorpay) {
          throw new ServiceUnavailableException('JE-Inspi payment processing is not configured');
        }
        order = await this.razorpay.orders.create(options);
      }

      const updatedOrder = await this.purchasedOrderCoreService.update({
        where: { id: purchaseOrder.id },
        data: {
          razorpayOrderId: order?.id ?? null,
        },
      });
      console.log(order);

      return {
        purchaseOrder: updatedOrder,
        orderItems,
        razorpayOrder: order,
        razorpayKeyId: order ? process.env.RAZORPAY_KEY_ID : undefined,
      };
    });
  }

  async verifyRazorpayWebhook(req: any, signature: string) {
    if (!process.env.RAZORPAY_SECRET) {
      throw new ServiceUnavailableException('Razorpay webhook verification is not configured');
    }
    if (!signature || !/^[a-f0-9]{64}$/i.test(signature)) {
      throw new BadRequestException('Invalid signature');
    }
    if (!req.rawBody) {
      console.log('Raw body missing');
      throw new BadRequestException('Raw body missing');
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(req.rawBody)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(signature, 'hex'))) {
      console.log('Invalid signature');
      throw new BadRequestException('Invalid signature');
    }

    const event = req.body;

    console.log(event?.event, 'event --------------razorpay----------------');
    console.log(event.payload.payment);

    if (
      event?.event === 'payment.captured' ||
      event?.event === 'payment.authorized'
    ) {
      const orderId = event?.payload?.payment?.entity?.order_id;
      const transactionId = event?.payload?.payment?.entity?.id;
      const order = await this.purchasedOrderCoreService.findFirst({
        where: {
          razorpayOrderId: orderId,
          isDeleted: false,
          status: STATUS.ENABLED,
        },
      });

      if (!order) {
        console.log('Order not found');
        throw new NotFoundException('Order not found');
      }

      console.log('___Success____');
      console.log(order, 'this is order');
      console.log(orderId, 'this is razorpay orderId');

      await this.purchasedOrderCoreService.update({
        where: { id: order.id },
        data: {
          transactionId,
          orderStatus: ORDER_STATUS.CONFIRMED,
          paymentStatus: PAYMENT_STATUS.PAID,
        },
      });
    } else if (event?.event === 'payment.failed') {
      const orderId = event?.payload?.payment?.entity?.order_id;
      const transactionId = event?.payload?.payment?.entity?.id;

      console.log(event.payload.payment);

      console.log('___Failed____');
      console.log(orderId, 'this is razorpay orderId');
      const order = await this.purchasedOrderCoreService.findFirst({
        where: {
          razorpayOrderId: orderId,
          isDeleted: false,
          status: STATUS.ENABLED,
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      await this.purchasedOrderCoreService.update({
        where: { id: order.id },
        data: {
          transactionId: transactionId,
          orderStatus: ORDER_STATUS.CANCELLED,
          paymentStatus: PAYMENT_STATUS.CANCELLED,
        },
      });
    }

    return { status: 'ok', data: { event } };
  }

  async updatePurchaseOrder(
    userId: string,
    orderId: string,
    updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    // Verify the order belongs to the user
    const existingOrder = await this.purchasedOrderCoreService.findFirst({
      where: {
        id: orderId,
        isDeleted: false,
        status: STATUS.ENABLED,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException(
        'Purchase order not found or does not belong to user',
      );
    }

    // Update the purchase order
    return await this.purchasedOrderCoreService.update({
      where: { id: orderId },
      data: {
        orderStatus: updatePurchaseOrderDto.orderStatus,
        paymentStatus: updatePurchaseOrderDto.paymentStatus,
        shippingAddress: updatePurchaseOrderDto.shippingAddress,
        shippingCity: updatePurchaseOrderDto.shippingCity,
        shippingState: updatePurchaseOrderDto.shippingState,
        shippingCountry: updatePurchaseOrderDto.shippingCountry,
        shippingPostalCode: updatePurchaseOrderDto.shippingPostalCode,
        transactionId: updatePurchaseOrderDto.transactionId,
      },
    });
  }

  async getPurchaseOrder(orderId: string) {
    console.log('hi');
    const purchaseOrder = await this.purchasedOrderCoreService.findFirst({
      where: {
        id: orderId,
        isDeleted: false,
        status: STATUS.ENABLED,
      },
      include: {
        orderItems: {
          where: {
            isDeleted: false,
            status: STATUS.ENABLED,
          },
          include: {
            jewellery: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: true,
              },
            },
            variant: {
              select: {
                id: true,
                size: true,
                basePrice: true,
              },
            },
          },
        },
      },
    });

    if (!purchaseOrder) {
      throw new NotFoundException('Purchase order not found');
    }

    return purchaseOrder;
  }

  async getLatestPurchaseOrdersForAdmin(
    dateFilterDto: DateFilterDto,
    baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    const { dateFrom, dateTo, orderStatus } = dateFilterDto;
    const whereClause: any = {
      isDeleted: false,
      status: STATUS.ENABLED,
      NOT: [
        {
          AND: [
            { paymentMethod: PAYMENT_MODE.INSTANT },
            { paymentStatus: PAYMENT_STATUS.PENDING },
          ],
        },
      ],
    };

    if (orderStatus) {
      whereClause.orderStatus = orderStatus;
    }

    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) {
        whereClause.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.createdAt.lte = new Date(dateTo);
      }
    }

    const orders = await this.purchasedOrderCoreService.findPaginate(
      baseQueryCoreDto,
      whereClause,
    );

    return orders;
  }

  async getLatestPurchaseOrders(
    sessionData: UserSessionType,
    dateFilterDto: DateFilterDto,
    baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    const { dateFrom, dateTo, orderStatus } = dateFilterDto;
    console.log(sessionData, 'ooooo');
    const whereClause: any = {
      userId: sessionData.user.id,
      isDeleted: false,
      status: STATUS.ENABLED,
      NOT: [
        {
          AND: [
            { paymentMethod: PAYMENT_MODE.INSTANT },
            { paymentStatus: PAYMENT_STATUS.PENDING },
          ],
        },
      ],
    };

    if (orderStatus) {
      whereClause.orderStatus = orderStatus;
    }

    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) {
        whereClause.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.createdAt.lte = new Date(dateTo);
      }
    }

    const orders = await this.purchasedOrderCoreService.findPaginate(
      baseQueryCoreDto,
      whereClause,
    );

    return orders;
  }

  async getPurchaseOrders(
    userId: string,
    dateFilterDto: DateFilterDto,
    baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    const { dateFrom, dateTo, orderStatus } = dateFilterDto;
    const whereClause: any = {
      userId,
      isDeleted: false,
      status: STATUS.ENABLED,
    };

    if (orderStatus) {
      whereClause.orderStatus = orderStatus;
    }

    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) {
        whereClause.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.createdAt.lte = new Date(dateTo);
      }
    }

    const orders = await this.purchasedOrderCoreService.findPaginate(
      baseQueryCoreDto,
      whereClause,
    );

    return orders;
  }

  async deletePurchaseOrder(userId: string, orderId: string) {
    const existingOrder = await this.purchasedOrderCoreService.findFirst({
      where: {
        id: orderId,
        userId,
        isDeleted: false,
        status: STATUS.ENABLED,
        orderStatus: ORDER_STATUS.PENDING,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException(
        'Purchase order not found or cannot be deleted',
      );
    }

    // Soft delete the order and its items
    return await this.prisma.prisma.$transaction(async (tx) => {
      // Soft delete order items
      await this.orderItemCoreService.updateMany({
        where: {
          orderId,
        },
        data: {
          isDeleted: true,
        },
      });

      // Soft delete the order
      return await this.purchasedOrderCoreService.update({
        where: { id: orderId },
        data: {
          isDeleted: true,
        },
      });
    });
  }

  async createFromCart(
    sessionData: UserSessionType,
    createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    const userId = sessionData.user.id;

    // Get user's cart items
    const cart: any = await this.cartCoreService.findFirst({
      where: {
        userId,
        isDeleted: false,
        status: STATUS.ENABLED,
      },
      include: {
        cartItems: {
          where: {
            isDeleted: false,
            status: STATUS.ENABLED,
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty or not found');
    }

    const orderItems = createPurchaseOrderDto.orderItems.map((cartItem) => ({
      jewelleryId: cartItem.jewelleryId,
      variantId: cartItem.variantId,
      quantity: cartItem.quantity,
      selectedColor: cartItem.selectedColor,
      selectedSize: cartItem.selectedSize,
      material: cartItem.material,
      includeCertificate: cartItem.includeCertificate,
      sku: cartItem.sku,
    }));

    // Create purchase order
    const purchaseOrder = await this.createPurchaseOrder(sessionData, {
      ...createPurchaseOrderDto,
      orderItems,
    });

    // Clear the cart after successful order creation
    await this.cartItemCoreService.updateMany({
      where: {
        cartId: cart.id,
        isDeleted: false,
        sku: {
          in: orderItems.map((item) => item.sku),
        },
      },
      data: {
        isDeleted: true,
      },
    });

    return purchaseOrder;
  }
}

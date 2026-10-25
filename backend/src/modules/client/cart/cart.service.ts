import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CartCoreService } from 'src/core/cart-core/cart-core.service';
import { CartItemCoreService } from 'src/core/cart-item-core/cart-item-core.service';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { JewelleryService } from '../jewellery/jewellery.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { DeleteCartItemDto } from './dto/delete-cart-item.dto';
import { STATUS } from '@prisma/client';
import { UserCoreService } from 'src/core/user-core/user-core.service';
import { UserSessionType } from 'src/shared/types/user-session.type';

@Injectable()
export class CartService {
  constructor(
    private readonly cartCoreService: CartCoreService,
    private readonly cartItemCoreService: CartItemCoreService,
    private readonly prisma: PrismaService,
    private jewelleryService: JewelleryService,
    private userCoreService: UserCoreService,
  ) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    // Check if user already has a cart, if not create one
    let cart = await this.cartCoreService.findFirst({
      where: {
        userId,
        isDeleted: false,
        status: STATUS.ENABLED,
      },
    });

    if (!cart) {
      cart = await this.cartCoreService.create({
        data: {
          userId,
        },
      });
    }

    // Check if item already exists in cart with same variant and options
    const existingCartItem = await this.cartItemCoreService.findFirst({
      where: {
        cartId: cart.id,
        jewelleryId: addToCartDto.jewelleryId,
        variantId: addToCartDto.variantId,
        selectedColor: addToCartDto.selectedColor,
        selectedSize: addToCartDto.selectedSize,
        material: addToCartDto.material,
        sku: addToCartDto.sku,
        includeCertificate: addToCartDto.includeCertificate,
        isDeleted: false,
        status: STATUS.ENABLED,
      },
    });

    if (existingCartItem) {
      // Update quantity and total price
      const newQuantity = existingCartItem.quantity + addToCartDto.quantity;

      return await this.cartItemCoreService.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
        },
      });
    }

    // Create new cart item
    return await this.cartItemCoreService.create({
      data: {
        cartId: cart.id,
        jewelleryId: addToCartDto.jewelleryId,
        variantId: addToCartDto.variantId,
        quantity: addToCartDto.quantity,
        sku: addToCartDto.sku,
        selectedColor: addToCartDto.selectedColor,
        selectedSize: addToCartDto.selectedSize,
        material: addToCartDto.material,
        includeCertificate: addToCartDto.includeCertificate,
      },
    });
  }

  async updateCartItem(userId: string, updateCartItemDto: UpdateCartItemDto) {
    // Verify the cart item belongs to the user
    const cartItem = await this.cartItemCoreService.findFirst({
      where: {
        id: updateCartItemDto.cartItemId,
        cart: {
          userId,
          isDeleted: false,
          status: STATUS.ENABLED,
        },
        isDeleted: false,
        status: STATUS.ENABLED,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(
        'Cart item not found or does not belong to user',
      );
    }

    // Update the cart item
    return await this.cartItemCoreService.update({
      where: { id: updateCartItemDto.cartItemId },
      data: {
        quantity: updateCartItemDto.quantity,
        includeCertificate: updateCartItemDto.includeCertificate,
      },
    });
  }

  async deleteCartItem(userId: string, deleteCartItemDto: DeleteCartItemDto) {
    // Verify the cart item belongs to the user
    const cartItem = await this.cartItemCoreService.findFirst({
      where: {
        id: deleteCartItemDto.cartItemId,
        cart: {
          userId,
          isDeleted: false,
          status: STATUS.ENABLED,
        },
        isDeleted: false,
        status: STATUS.ENABLED,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(
        'Cart item not found or does not belong to user',
      );
    }

    // Soft delete the cart item
    return await this.cartItemCoreService.update({
      where: { id: deleteCartItemDto.cartItemId },
      data: {
        isDeleted: true,
      },
    });
  }

  async getCart(sessionData: UserSessionType) {
    // Get user's cart with all items
    const cart: any = await this.cartCoreService.findFirst({
      where: {
        userId: sessionData.user.id,
        isDeleted: false,
        status: STATUS.ENABLED,
      },
      include: {
        cartItems: {
          where: {
            isDeleted: false,
            status: STATUS.ENABLED,
          },
          include: {
            jewellery: {
              select: {
                id: true,
                name: true,
                images: true,
                isDeleted: true,
                status: true,
              },
            },
            variant: {
              select: {
                id: true,
                size: true,
                basePrice: true,
                isDeleted: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return {
        id: null,
        cartItems: [],
        totalItems: 0,
        subtotal: 0,
      };
    }

    let cartItems = cart.cartItems;
    if (cart && cartItems.length > 0) {
      cartItems = cartItems.filter(
        (item: any) =>
          item.jewellery.isDeleted === false &&
          item.jewellery.status === STATUS.ENABLED &&
          item.variant.isDeleted === false &&
          item.variant.status === STATUS.ENABLED,
      );
    }

    const user = await this.userCoreService.findFirst({
      where: {
        id: sessionData.user.id,
        isDeleted: false,
        status: STATUS.ENABLED,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate unit price for each cart item
    const cartItemsWithPrices = await Promise.all(
      cartItems.map(async (item: any) => {
        const calculatePriceDto = {
          variantId: item.variantId,
          material: item.material,
          includeCertificate: item.includeCertificate,
        };
        const priceResult = await this.jewelleryService.calculateJewelleryPrice(
          calculatePriceDto,
          sessionData,
        );

        let unitPrice;

        if (user && user.discount && user.discount > 0) {
          unitPrice = priceResult.discountedPrice;
        } else {
          unitPrice = Number(priceResult.finalPrice);
        }

        return {
          ...item,
          unitPrice,
          totalPrice: unitPrice * item.quantity,
        };
      }),
    );

    // Calculate totals
    const totalItems = cartItemsWithPrices.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const subtotal = cartItemsWithPrices.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    return {
      id: cart.id,
      cartItems: cartItemsWithPrices,
      totalItems,
      subtotal,
    };
  }
}

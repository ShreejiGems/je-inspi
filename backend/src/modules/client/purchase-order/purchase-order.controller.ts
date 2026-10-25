import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Req,
  Headers,
  RawBody,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PurchaseOrderService } from './purchase-order.service';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  GetPurchaseOrdersDto,
  DateFilterDto,
} from './dto/purchase-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetUserSession } from 'src/shared/decorators/get-user-session.decorator';
import { UserSessionType } from 'src/shared/types/user-session.type';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import { AdminMutationGuard } from 'src/shared/guards/admin-mutation.guard';

@ApiTags('Purchase Orders')
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new purchase order' })
  async createPurchaseOrder(
    @GetUserSession() sessionData: UserSessionType,
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    return await this.purchaseOrderService.createPurchaseOrder(
      sessionData,
      createPurchaseOrderDto,
    );
  }

  @Post('razorpay/webhook')
  async verifyRazorpayWebhook(
    @Req() req: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return await this.purchaseOrderService.verifyRazorpayWebhook(
      req,
      signature,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('from-cart')
  @ApiOperation({ summary: 'Create purchase order from cart items' })
  @ApiResponse({
    status: 201,
    description: 'Purchase order created from cart successfully',
  })
  async createFromCart(
    @GetUserSession() sessionData: UserSessionType,
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    return await this.purchaseOrderService.createFromCart(
      sessionData,
      createPurchaseOrderDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/latest-orders')
  @ApiOperation({ summary: 'Get all purchase orders to see for admin' })
  async getLatestPurchaseOrdersForAdmin(
    @Query() dateFilterDto: DateFilterDto,
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    return await this.purchaseOrderService.getLatestPurchaseOrdersForAdmin(
      dateFilterDto,
      baseQueryCoreDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('latest-orders')
  @ApiOperation({ summary: 'Get all purchase orders for the user' })
  async getLatestPurchaseOrders(
    @GetUserSession() sessionData: UserSessionType,
    @Query() dateFilterDto: DateFilterDto,
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    return await this.purchaseOrderService.getLatestPurchaseOrders(
      sessionData,
      dateFilterDto,
      baseQueryCoreDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':userId/list')
  @ApiOperation({
    summary: 'Get all purchase orders for the user by passing userId',
  })
  async getPurchaseOrders(
    @Param('userId') userId: string,
    @Query() dateFilterDto: DateFilterDto,
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    return await this.purchaseOrderService.getPurchaseOrders(
      userId,
      dateFilterDto,
      baseQueryCoreDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific purchase order by ID' })
  async getPurchaseOrder(@Param('id') orderId: string) {
    return await this.purchaseOrderService.getPurchaseOrder(orderId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a purchase order' })
  async updatePurchaseOrder(
    @GetUserSession() sessionData: UserSessionType,
    @Param('id') orderId: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    return await this.purchaseOrderService.updatePurchaseOrder(
      sessionData.user.id,
      orderId,
      updatePurchaseOrderDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a purchase order (soft delete)' })
  async deletePurchaseOrder(
    @GetUserSession() sessionData: UserSessionType,
    @Param('id') orderId: string,
  ) {
    return await this.purchaseOrderService.deletePurchaseOrder(
      sessionData.user.id,
      orderId,
    );
  }
}

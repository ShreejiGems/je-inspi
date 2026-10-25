import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  JEWELRY_COLOR,
  MATERIAL,
  PAYMENT_MODE,
  ORDER_STATUS,
  CHECKOUT_CURRENCY,
  PAYMENT_STATUS,
} from '@prisma/client';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Jewellery ID',
    example: 'uuid-string-here',
  })
  @IsString()
  jewelleryId: string;

  @ApiProperty({
    description: 'Jewellery variant ID',
    example: 'uuid-string-here',
  })
  @IsString()
  variantId: string;

  @ApiProperty({
    description: 'SKU of the jewellery variant',
    example: 'SKU-12345',
  })
  @IsString()
  sku: string;

  @ApiProperty({
    description: 'Quantity of items',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Selected jewelry color',
    enum: JEWELRY_COLOR,
    required: false,
  })
  @IsOptional()
  @IsEnum(JEWELRY_COLOR)
  selectedColor?: JEWELRY_COLOR;

  @ApiProperty({
    description: 'Selected size',
    example: 16,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  selectedSize?: number;

  @ApiProperty({
    description: 'Selected material',
    enum: MATERIAL,
  })
  @IsEnum(MATERIAL)
  material: MATERIAL;

  @ApiProperty({
    description: 'Include certificate',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeCertificate?: boolean;
}

export class DateFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dateFrom?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dateTo?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orderStatus?: ORDER_STATUS;
}

export class CreatePurchaseOrderDto {
  @ApiProperty({
    description: 'Array of order items',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];

  @ApiProperty({
    description: 'Payment method',
    enum: PAYMENT_MODE,
    example: PAYMENT_MODE.INSTANT,
  })
  @IsEnum(PAYMENT_MODE)
  paymentMethod: PAYMENT_MODE;

  @ApiProperty({
    description: 'Shipping address',
    example: '123 Main Street',
  })
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    description: 'Shipping city',
    example: 'New York',
  })
  @IsString()
  shippingCity: string;

  @ApiProperty({
    description: 'Shipping state',
    example: 'NY',
  })
  @IsString()
  shippingState: string;

  @ApiProperty({
    description: 'Shipping country',
    example: 'USA',
  })
  @IsString()
  shippingCountry: string;

  @ApiProperty({
    description: 'Shipping postal code',
    example: '10001',
  })
  @IsString()
  shippingPostalCode: string;

  @ApiProperty({
    description: 'Transaction ID for payment',
    example: 'txn_123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({
    description: 'Checkout currency',
    required: true,
  })
  @IsEnum(CHECKOUT_CURRENCY)
  checkoutCurrency: CHECKOUT_CURRENCY;
}

export class UpdatePurchaseOrderDto {
  @ApiProperty({
    description: 'Order status',
    enum: ORDER_STATUS,
  })
  @IsEnum(ORDER_STATUS)
  orderStatus: ORDER_STATUS;

  @ApiProperty({
    description: 'Payment status',
    enum: PAYMENT_STATUS,
  })
  @IsEnum(PAYMENT_STATUS)
  paymentStatus: PAYMENT_STATUS;

  @ApiProperty({
    description: 'Shipping address',
    required: false,
  })
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiProperty({
    description: 'Shipping city',
    required: false,
  })
  @IsOptional()
  @IsString()
  shippingCity?: string;

  @ApiProperty({
    description: 'Shipping state',
    required: false,
  })
  @IsOptional()
  @IsString()
  shippingState?: string;

  @ApiProperty({
    description: 'Shipping country',
    required: false,
  })
  @IsOptional()
  @IsString()
  shippingCountry?: string;

  @ApiProperty({
    description: 'Shipping postal code',
    required: false,
  })
  @IsOptional()
  @IsString()
  shippingPostalCode?: string;

  @ApiProperty({
    description: 'Transaction ID for payment',
    required: false,
  })
  @IsOptional()
  @IsString()
  transactionId?: string;
}

export class GetPurchaseOrdersDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by order status',
    enum: ORDER_STATUS,
    required: false,
  })
  @IsOptional()
  @IsEnum(ORDER_STATUS)
  orderStatus?: ORDER_STATUS;

  @ApiProperty({
    description: 'Filter by date from',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({
    description: 'Filter by date to',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}

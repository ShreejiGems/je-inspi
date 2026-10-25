import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsBoolean,
} from 'class-validator';
import { JEWELRY_COLOR, MATERIAL } from '@prisma/client';

export class AddToCartDto {
  @ApiProperty({
    description: 'Jewellery ID to add to cart',
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
    description: 'Quantity of items to add',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'SKU of the item',
    example: 'JWL-001-16-ROUND',
  })
  @IsString()
  sku: string;

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
    required: false,
  })
  @IsOptional()
  @IsEnum(MATERIAL)
  material?: MATERIAL;

  @ApiProperty({
    description: 'Include certificate',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeCertificate?: boolean;
}

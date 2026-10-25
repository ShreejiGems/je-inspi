import { ApiProperty } from '@nestjs/swagger';
import { IMAGE_TYPE, MEDIA_TYPE } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export enum PRODUCT_TYPE {
  JEWELLERY = 'JEWELLERY',
  DIAMOND = 'DIAMOND',
}

export class AddSectionImageDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ required: true, enum: IMAGE_TYPE })
  @IsEnum(IMAGE_TYPE)
  @IsNotEmpty()
  imageType: IMAGE_TYPE;

  @ApiProperty({ required: true, enum: MEDIA_TYPE })
  @IsEnum(MEDIA_TYPE)
  @IsNotEmpty()
  mediaType: MEDIA_TYPE;
}

export class PriceFilterDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  min: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  max: number;
}

export class MarketingImagesDto {
  @ApiProperty({ required: true })
  @IsArray()
  @IsNotEmpty()
  images: string[];
}

export class AddPrimeProductDto {
  @ApiProperty({
    required: false,
    description:
      'consider to add categoryId if want to add jewellery prime-product',
  })
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty({
    required: true,
    description: 'productId (either jewellery productId or diamond prodcuId)',
  })
  @IsString()
  productId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  primeImage: string;

  @ApiProperty({
    required: true,
    enum: PRODUCT_TYPE,
  })
  @IsEnum(PRODUCT_TYPE)
  @IsOptional()
  productType: PRODUCT_TYPE;
}

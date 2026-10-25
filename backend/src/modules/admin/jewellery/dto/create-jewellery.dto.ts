import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { JEWELRY_COLOR, GEM_ORIGIN } from '@prisma/client';

// DTO for gem details
export class GemDetailDto {
  @ApiProperty({
    required: true,
    description: 'Gem shape',
  })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsNotEmpty()
  shape: string;

  @ApiProperty({ required: true, description: 'Gem dimensions in MM' })
  @IsString()
  @IsNotEmpty()
  mm: string;

  @ApiProperty({ required: true, description: 'Gem weight in carats' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ required: true, description: 'Gem color' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ required: true, description: 'Gem clarity' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsNotEmpty()
  clarity: string;

  @ApiProperty({ required: true, description: 'Gem quantity' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

// DTO for material details
export class MaterialDetailDto {
  @ApiProperty({ required: true, description: 'Grams in silver' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  silver: number;

  @ApiProperty({ required: true, description: 'Grams in 10Kt gold' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  tenKtGold: number;

  @ApiProperty({ required: true, description: 'Grams in 14Kt gold' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  forteenKtGold: number;

  @ApiProperty({ required: true, description: 'Grams in 18Kt gold' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  eighteenKtGold: number;
}

// DTO for measurements
export class MeasurementDto {
  @ApiProperty({ required: true, description: 'field' })
  @IsString()
  @IsOptional()
  field?: string;

  @ApiProperty({ required: true, description: 'value' })
  @IsString()
  @IsOptional()
  value?: string;
}

// DTO for jewellery variant
export class JewelleryVariantDto {
  @ApiProperty({ required: false, description: 'Variant ID (for updates)' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ required: true, description: 'Variant size' })
  @IsNumber()
  @IsNotEmpty()
  size: number;

  // @ApiProperty({ required: true, description: 'Jewellery color' })
  // @IsEnum(JEWELRY_COLOR)
  // @IsNotEmpty()
  // color: JEWELRY_COLOR;

  @ApiProperty({
    required: true,
    enum: GEM_ORIGIN,
    description: 'Gem origin (e.g., LAB_GROWN)',
  })
  @IsEnum(GEM_ORIGIN)
  @IsNotEmpty()
  gemOrigin: GEM_ORIGIN;

  @ApiProperty({
    required: true,
    type: [GemDetailDto],
    description: 'Gem details',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GemDetailDto)
  gemDetails: GemDetailDto[];

  @ApiProperty({
    required: true,
    type: MaterialDetailDto,
    description: 'Material details',
  })
  @ValidateNested({ each: true })
  @Type(() => MaterialDetailDto)
  materialDetails: MaterialDetailDto;

  @ApiProperty({
    required: false,
    type: [MeasurementDto],
    description: 'Measurements',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MeasurementDto)
  measurements?: MeasurementDto[];
}

// DTO for jewellery image
export class JewelleryImageDto {
  @ApiProperty({ required: true, description: 'Image URL or path' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    required: true,
    enum: JEWELRY_COLOR,
    description: 'Jewellery color',
  })
  @IsEnum(JEWELRY_COLOR)
  @IsNotEmpty()
  color: JEWELRY_COLOR;
}

// Main DTO for creating jewellery
export class CreateJewelleryDto {
  @ApiProperty({ required: true, description: 'Jewellery name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, description: 'SKU code' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ required: true, description: 'Category ID' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: true, description: 'Sub-category ID' })
  @IsUUID()
  @IsNotEmpty()
  subCategoryId: string;

  @ApiProperty({ required: true, description: 'Type ID' })
  @IsUUID()
  @IsNotEmpty()
  typeId: string;

  @ApiProperty({ required: true, description: 'Detailed description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    required: true,
    type: [JewelleryVariantDto],
    description: 'Jewellery variants',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JewelleryVariantDto)
  variants: JewelleryVariantDto[];

  @ApiProperty({ required: false, description: 'Collection ID' })
  @IsArray()
  @IsOptional()
  collectionId?: string[];

  @ApiProperty({
    required: false,
    type: [JewelleryImageDto],
    description: 'Jewellery images',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => JewelleryImageDto)
  images?: JewelleryImageDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { JEWELRY_COLOR } from '@prisma/client';

export class JewellerySearchDto {
  @ApiProperty({ required: false, description: 'Search by jewellery name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, description: 'Search by SKU' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ required: false, description: 'Filter by category ID' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false, description: 'Filter by sub-category ID' })
  @IsUUID()
  @IsOptional()
  subCategoryId?: string;

  @ApiProperty({ required: false, description: 'Filter by type ID' })
  @IsUUID()
  @IsOptional()
  typeId?: string;

  @ApiProperty({ required: false, description: 'Filter by collection ID' })
  @IsUUID()
  @IsOptional()
  collectionId?: string;

  @ApiProperty({
    required: false,
    enum: JEWELRY_COLOR,
    description: 'Filter by jewellery color',
  })
  @IsEnum(JEWELRY_COLOR)
  @IsOptional()
  color?: JEWELRY_COLOR;

  @ApiProperty({ required: false, description: 'Filter by gem origin' })
  @IsString()
  @IsOptional()
  gemOrigin?: string;
}

export class JewelleryFilterDto extends JewellerySearchDto {
  @ApiProperty({ required: false, description: 'Page number for pagination' })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: 'Number of items per page' })
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false, description: 'Sort by field' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}

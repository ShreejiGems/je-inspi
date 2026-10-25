import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  Contains,
  IsInt,
  Max,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import { MAX_FIND_ALL_LIMIT } from 'src/keys';
import { GEM_ORIGIN, MATERIAL } from '@prisma/client';

/**
 * DTO for filtering jewellery products
 * All parameters are optional and can be combined for advanced filtering
 */
export class JewelleryFilterDto extends BaseQueryCoreDto {
  @ApiProperty({
    description: 'Filter by category ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: 'Filter by sub-category ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  subCategoryId?: string;

  @ApiProperty({
    description: 'Filter by type ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  typeId?: string;

  @ApiProperty({
    description: 'Filter by collection ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  collectionId?: string;

  @ApiProperty({
    description: 'Filter by array of sizes (comma-separated)',
    required: false,
    example: '16,18,20',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((s) => !isNaN(s));
    }
    return value;
  })
  sizes?: number[];

  @ApiProperty({
    description: 'gem origin - labgrown or natural',
    required: false,
  })
  @IsOptional()
  @IsEnum(GEM_ORIGIN)
  gemOrigin?: GEM_ORIGIN;

  @ApiProperty({
    description: 'Filter by array of diamond shapes (comma-separated)',
    required: false,
    example: 'ROUND,OVAL,PRINCESS',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s) => s.length > 0);
    }
    return value;
  })
  shapes?: string[];

  @ApiProperty({
    description: 'Filter by array of materials (comma-separated)',
    required: false,
  })
  @IsOptional()
  @IsEnum(MATERIAL, { each: true })
  material?: string[];

  @ApiProperty({
    description: 'Filter by minimum price',
    required: false,
    example: '10000',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  minPrice?: number;

  @ApiProperty({
    description: 'Filter by maximum price',
    required: false,
    example: '20000',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  maxPrice?: number;
}

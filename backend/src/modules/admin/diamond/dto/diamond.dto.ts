import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { GEM_ORIGIN } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';

export const primaryShape = [
  'ROUND',
  'OVAL',
  'PRINCESS',
  'CUSHION',
  'EMERALD',
  'RADIANT',
  'ASSCHER',
  'MARQUISE',
  'HEART',
  'PEAR',
];

export const primaryColor = [
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O-P',
  'Q-R',
  'S-T',
  'U-V',
  'Y-Z',
];

export const primaryClarity = [
  'FL',
  'I1',
  'I2',
  'IF',
  'SI1',
  'SI2',
  'VS1',
  'VS2',
  'VVS1',
  'VVS2',
];

export const primaryCut = ['EX', 'VG', 'GD', 'FR', 'PD', 'EXCELLENT', 'VERY GOOD', 'GOOD', 'FAIR', 'POOR'];

export const primarySymmetry = ['EX', 'VG', 'GD', 'FR', 'EXCELLENT', 'VERY GOOD', 'GOOD', 'FAIR'];

export const primaryPolish = ['EX', 'VG', 'GD', 'FR', 'EXCELLENT', 'VERY GOOD', 'GOOD', 'FAIR'];

export const primaryFluorescence = [
  'FNT', 'MED', 'NON', 'SLT', 'STG', 'VSL', 'VSTG',
  'FAINT',
  'MEDIUM',
  'NONE',
  'SLIGHT',
  'STRONG',
  'VERY SLIGHT',
  'VERY STRONG',
];

export class CreateDiamondDto {
  @ApiProperty({ required: true, description: 'Diamond name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, description: 'SKU code' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ enum: GEM_ORIGIN, default: GEM_ORIGIN.NATURAL })
  @IsEnum(GEM_ORIGIN)
  @IsNotEmpty()
  gemOrigin: GEM_ORIGIN;

  @ApiProperty({ required: true, description: 'Diamond shape' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsNotEmpty()
  shape: string;

  @ApiProperty({ required: true, description: 'Diamond weight in carats' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ required: true, description: 'Diamond color' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ required: true, description: 'Diamond clarity' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsNotEmpty()
  clarity: string;

  @ApiProperty({ required: false, description: 'Diamond cut' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  cut?: string;

  @ApiProperty({ required: false, description: 'Diamond symmetry' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  symmetry?: string;

  @ApiProperty({ required: false, description: 'Lab' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  lab?: string;

  @ApiProperty({ required: false, description: 'Diamond polish' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  polish?: string;

  @ApiProperty({ required: false, description: 'Certificate number' })
  @IsString()
  @IsOptional()
  certificateNo?: string;

  @ApiProperty({ required: false, description: 'Diamond height' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  height?: number;

  @ApiProperty({ required: false, description: 'Diamond width' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  width?: number;

  @ApiProperty({ required: false, description: 'Diamond length' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  length?: number;

  @ApiProperty({ required: false, description: 'Total depth in percentage' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  totalDepthInPercentage?: number;

  @ApiProperty({ required: false, description: 'Total width in percentage' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  totalWidthInPercentage?: number;

  @ApiProperty({ required: false, description: 'Diamond girdle' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  girdle?: string;

  @ApiProperty({ required: false, description: 'Diamond fluorescence' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  fluorescence?: string;

  @ApiProperty({ required: true, description: 'Diamond images' })
  @IsArray()
  @IsNotEmpty()
  images: any;

  @ApiProperty({ required: false, description: 'Diamond videos' })
  @IsArray()
  @IsOptional()
  videos?: any;

  @ApiProperty({ required: true, description: 'Rap price' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  rap: number;

  @ApiProperty({ required: true, description: 'Price' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  price: number;
}

export class UpdateDiamondDto {
  @ApiPropertyOptional({ description: 'Diamond name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'SKU code' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ enum: GEM_ORIGIN })
  @IsEnum(GEM_ORIGIN)
  @IsOptional()
  gemOrigin?: GEM_ORIGIN;

  @ApiPropertyOptional({ description: 'Diamond shape' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  shape?: string;

  @ApiPropertyOptional({ description: 'Diamond weight in carats' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Diamond color' })
  @Transform(({ value }) => value.toUpperCase())
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ description: 'Diamond clarity' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  clarity?: string;

  @ApiPropertyOptional({ description: 'Diamond cut' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  cut?: string;

  @ApiPropertyOptional({ description: 'Diamond symmetry' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  symmetry?: string;

  @ApiPropertyOptional({ description: 'Lab' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  lab?: string;

  @ApiPropertyOptional({ description: 'Diamond polish' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  polish?: string;

  @ApiPropertyOptional({ description: 'Certificate number' })
  @IsString()
  @IsOptional()
  certificateNo?: string;

  @ApiPropertyOptional({ description: 'Diamond height' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ description: 'Diamond width' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  width?: number;

  @ApiPropertyOptional({ description: 'Diamond length' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  length?: number;

  @ApiPropertyOptional({ description: 'Total depth in percentage' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  totalDepthInPercentage?: number;

  @ApiPropertyOptional({ description: 'Total width in percentage' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  totalWidthInPercentage?: number;

  @ApiPropertyOptional({ description: 'Diamond girdle' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  girdle?: string;

  @ApiPropertyOptional({ description: 'Diamond fluorescence' })
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @IsOptional()
  fluorescence?: string;

  @ApiPropertyOptional({ description: 'Diamond images' })
  @IsArray()
  @IsOptional()
  images?: any;

  @ApiPropertyOptional({ description: 'Diamond videos' })
  @IsArray()
  @IsOptional()
  videos?: any;

  @ApiPropertyOptional({ description: 'Rap price' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  rap?: number;

  @ApiPropertyOptional({ description: 'Price' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  price?: number;
}

export class SearchDiamondsDto {
  @ApiPropertyOptional({ description: 'Is User API' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isUserApi?: boolean;

  @ApiPropertyOptional({ description: 'Search by name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Search by SKU' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ enum: GEM_ORIGIN })
  @IsEnum(GEM_ORIGIN)
  @IsOptional()
  gemOrigin?: GEM_ORIGIN;

  @ApiPropertyOptional({
    description: 'Search by shape (comma-separated for multiple values)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string')
      return value.split(',').map((v) => v.trim().toUpperCase());
    return value;
  })
  shape?: string | string[];

  @ApiPropertyOptional({ description: 'Minimum weight in carats' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  minWeight?: number;

  @ApiPropertyOptional({ description: 'Maximum weight in carats' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  maxWeight?: number;

  @ApiPropertyOptional({
    description: 'Search by color (comma-separated for multiple values)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string')
      return value.split(',').map((v) => v.trim().toUpperCase());
    return value;
  })
  color?: string | string[];

  @ApiPropertyOptional({
    description: 'Search by clarity (comma-separated for multiple values)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string')
      return value.split(',').map((v) => v.trim().toUpperCase());
    return value;
  })
  clarity?: string | string[];

  @ApiPropertyOptional({
    description: 'Search by cut (comma-separated for multiple values)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string')
      return value.split(',').map((v) => v.trim().toUpperCase());
    return value;
  })
  cut?: string | string[];

  @ApiPropertyOptional({
    description: 'Search by lab (comma-separated for multiple values)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string')
      return value.split(',').map((v) => v.trim().toUpperCase());
    return value;
  })
  lab?: string | string[];

  @ApiPropertyOptional({ description: 'Search by certificate number' })
  @IsString()
  @IsOptional()
  certificateNo?: string;

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Search by fluorescence (comma-separated for multiple values)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string')
      return value.split(',').map((v) => v.trim().toUpperCase());
    return value;
  })
  fluorescence?: string[];

  @ApiPropertyOptional({ description: 'Minimum width percentage' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  minWidthPercentage?: number;

  @ApiPropertyOptional({ description: 'Maximum width percentage' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  maxWidthPercentage?: number;

  @ApiPropertyOptional({ description: 'Minimum depth percentage' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  minDepthPercentage?: number;

  @ApiPropertyOptional({ description: 'Maximum depth percentage' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  maxDepthPercentage?: number;

  @ApiPropertyOptional({
    description: 'Search by symmetry (comma-separated for multiple values)',
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string')
      return value.split(',').map((v) => v.trim().toUpperCase());
    return value;
  })
  symmetry?: string[];

  @ApiPropertyOptional({
    description: 'Search by polish (comma-separated for multiple values)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string')
      return value.split(',').map((v) => v.trim().toUpperCase());
    return value;
  })
  polish?: string[];
}

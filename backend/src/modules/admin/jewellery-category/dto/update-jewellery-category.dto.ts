import { ApiProperty } from '@nestjs/swagger';
import { CATEGPRY_TYPE } from '@prisma/client';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateJewelleryCategoryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryName?: string;

  @ApiProperty({ required: false, enum: CATEGPRY_TYPE })
  @IsEnum(CATEGPRY_TYPE)
  @IsOptional()
  categoryType?: CATEGPRY_TYPE;
}

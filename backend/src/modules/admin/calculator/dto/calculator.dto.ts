import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class EditCalculatorDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  miscellaneous: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  silverPerGram: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  tenKtGoldPerGram: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  forteenKtGoldPerGram: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  eighteenKtGoldPerGram: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  extraCost: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  duty: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  profit: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  usRate: number;
}

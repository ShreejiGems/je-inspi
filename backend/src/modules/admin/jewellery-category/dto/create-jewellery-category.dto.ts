import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJewelleryCategoryDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  categoryName: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateJewelleryTypeDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  typeName: string;
}

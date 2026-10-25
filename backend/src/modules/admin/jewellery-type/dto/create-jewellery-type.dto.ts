import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateJewelleryTypeDto {
  @ApiProperty({ required: true })
  @IsUUID()
  @IsNotEmpty()
  subCategoryId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  typeName: string;
}

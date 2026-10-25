import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateJewellerySubCategoryDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  subCategoryName: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateJewellerySubCategoryDto {
  @ApiProperty({ required: true })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  subCategoryName: string;
}

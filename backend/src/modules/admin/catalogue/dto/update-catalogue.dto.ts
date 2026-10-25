import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCatalogueDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  coverImage: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  pdfUrl: string;
}

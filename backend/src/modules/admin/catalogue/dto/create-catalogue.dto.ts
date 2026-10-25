import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogueDto {
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

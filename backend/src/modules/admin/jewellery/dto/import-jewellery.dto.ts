import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class ImportJewelleryDto {
  @ApiProperty({
    description: 'URL of the Excel file containing jewellery data',
    example: 'https://storage.example.com/jewellery/import.xlsx',
  })
  @IsUrl({}, { message: 'Invalid URL format' })
  @IsNotEmpty({ message: 'File URL is required' })
  fileUrl: string;
}

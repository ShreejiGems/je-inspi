import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCertificateDto {
  @ApiProperty({ description: 'Starting weight range for the certificate' })
  @IsNumber()
  weightStartsAt: number;

  @ApiProperty({ description: 'Ending weight range for the certificate' })
  @IsNumber()
  weightEndsAt: number;

  @ApiProperty({ description: 'Price for the certificate' })
  @IsNumber()
  price: number;
}

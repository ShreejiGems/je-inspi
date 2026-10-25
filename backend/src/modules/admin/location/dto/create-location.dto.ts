import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  email: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateLocationDto {
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

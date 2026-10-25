import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Cart item ID to update',
    example: 'uuid-string-here',
  })
  @IsString()
  cartItemId: string;

  @ApiProperty({
    description: 'New quantity for the cart item',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Include certificate',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeCertificate?: boolean;
}

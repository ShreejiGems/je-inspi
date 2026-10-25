import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteCartItemDto {
  @ApiProperty({
    description: 'Cart item ID to delete',
    example: 'uuid-string-here',
  })
  @IsString()
  cartItemId: string;
}

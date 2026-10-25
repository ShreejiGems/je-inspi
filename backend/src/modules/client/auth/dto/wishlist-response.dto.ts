import { ApiProperty } from '@nestjs/swagger';

export class WishlistItemDto {
  @ApiProperty({ description: 'Wishlist item ID' })
  id: string;

  @ApiProperty({ description: 'Jewellery ID' })
  jewelleryId: string;

  @ApiProperty({ description: 'Jewellery name' })
  name: string;

  @ApiProperty({ description: 'Jewellery SKU' })
  sku: string;

  @ApiProperty({ description: 'Jewellery base price' })
  basePrice: number;

  @ApiProperty({ description: 'Jewellery images' })
  images: any;

  @ApiProperty({ description: 'Date when item was added to wishlist' })
  addedAt: Date;
}

export class WishlistResponseDto {
  @ApiProperty({ description: 'List of wishlist items', type: [WishlistItemDto] })
  items: WishlistItemDto[];

  @ApiProperty({ description: 'Total number of items in wishlist' })
  total: number;
}

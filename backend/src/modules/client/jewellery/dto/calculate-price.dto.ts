import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CalculateJewelleryPriceDto {
  @ApiProperty({
    description: 'Jewellery variant ID',
    example: 'uuid-string',
  })
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @ApiProperty({
    description: 'Material type for price calculation',
    enum: [
      'silver',
      'tenKtGold',
      'forteenKtGold',
      'eighteenKtGold',
      'SILVER',
      'TENKTGOLD',
      'FOURTEENKTGOLD',
      'EIGHTEENKTGOLD',
      'TEN_KT_GOLD',
      'FORTEEN_KT_GOLD',
      'EIGHTEEN_KT_GOLD',
    ],
    example: 'silver',
  })
  @IsString()
  @IsNotEmpty()
  material:
    | 'silver'
    | 'tenKtGold'
    | 'forteenKtGold'
    | 'eighteenKtGold'
    | 'SILVER'
    | 'TENKTGOLD'
    | 'FOURTEENKTGOLD'
    | 'EIGHTEENKTGOLD'
    | 'TEN_KT_GOLD'
    | 'FORTEEN_KT_GOLD'
    | 'EIGHTEEN_KT_GOLD';

  @ApiProperty({
    description: 'Whether to include certificate in price calculation',
    example: 'true',
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return value;
  })
  @IsBoolean()
  includeCertificate: boolean;
}

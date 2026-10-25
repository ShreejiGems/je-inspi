import { ApiProperty } from '@nestjs/swagger';
import { JewelleryVariant } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from 'src/core/base-query-core/dto/base-query-core.dto';

export class JewelleryVariantCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: JewelleryVariant[];
}

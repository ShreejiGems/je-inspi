import { ApiProperty } from '@nestjs/swagger';
import { DiamondProduct } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from 'src/core/base-query-core/dto/base-query-core.dto';

export class DiamondProductCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: DiamondProduct[];
}

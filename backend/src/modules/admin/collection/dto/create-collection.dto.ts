import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  collectionName: string;
}

import { PartialType } from '@nestjs/swagger';
import { CreateJewelleryDto } from './create-jewellery.dto';

export class UpdateJewelleryDto extends PartialType(CreateJewelleryDto) {}

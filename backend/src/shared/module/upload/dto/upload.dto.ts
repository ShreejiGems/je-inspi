import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export enum FILE_TYPE {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
}

export enum RESOURCE_TYPE {
  JEWELLERY = 'JEWELLERY',
  DIAMOND = 'DIAMOND',
  USER = 'USER',
  OTHER = 'OTHER',
}

export class UploadFileDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ enum: FILE_TYPE })
  @IsEnum(FILE_TYPE)
  fileType: FILE_TYPE;

  @ApiProperty({ enum: RESOURCE_TYPE })
  @ValidateIf((o) => o.type === RESOURCE_TYPE.JEWELLERY)
  @IsEnum(RESOURCE_TYPE)
  resourceType: RESOURCE_TYPE;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestPasswordResetDto {
  @ApiProperty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  @IsEmail()
  @MaxLength(254)
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @Matches(/^[a-f0-9]{64}$/)
  token: string;

  @ApiProperty({ minLength: 12, maxLength: 72 })
  @IsString()
  @Length(12, 72)
  password: string;
}

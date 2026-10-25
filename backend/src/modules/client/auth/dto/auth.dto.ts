import { ApiProperty } from '@nestjs/swagger';
import {
  BUSSINESS_TYPE,
  PAYMENT_MODE,
  REG_TYPE,
  USER_TYPE,
} from '@prisma/client';
import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export const OTP_TYPE = {
  REGISTER: 'REGISTER',
  FORGET_PASSWORD: 'FORGET_PASSWORD',
};

export class AdminSignupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class EmailOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class ContactSyncDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  phoneNumbers: string[];
}

export class ReferenceDetailsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactPersonName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class UserSignupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  registrationCopyImage: string;

  @ApiProperty({ enum: REG_TYPE })
  @IsEnum(REG_TYPE)
  @IsNotEmpty()
  registrationCopyType: REG_TYPE;

  @ApiProperty({ enum: BUSSINESS_TYPE })
  @IsEnum(BUSSINESS_TYPE)
  @IsNotEmpty()
  bussinessType: BUSSINESS_TYPE;

  @ApiProperty({ required: true, type: ReferenceDetailsDto })
  @Type(() => ReferenceDetailsDto)
  @IsNotEmpty()
  referenceDetail: ReferenceDetailsDto;
}

export class ApproveUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: true, description: 'discount' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  discount?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  paymentCycle?: number;

  @ApiProperty({ enum: PAYMENT_MODE })
  @IsEnum(PAYMENT_MODE)
  @IsOptional()
  paymentMode?: PAYMENT_MODE;
}

export class VerifyEmailOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  referenceNo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: USER_TYPE, required: true })
  @IsEnum(USER_TYPE)
  @IsNotEmpty()
  userType: USER_TYPE;
}

export class OrganizationPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class MainAdminDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profile?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  countryCode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  phoneNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  introVideo?: string;
}

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  registrationCopyImage?: string;

  @ApiProperty({ enum: REG_TYPE })
  @IsEnum(REG_TYPE)
  @IsOptional()
  registrationCopyType?: REG_TYPE;

  @ApiProperty({ enum: BUSSINESS_TYPE })
  @IsEnum(BUSSINESS_TYPE)
  @IsOptional()
  bussinessType?: BUSSINESS_TYPE;

  @ApiProperty({ type: () => ReferenceDetailsDto })
  @IsOptional()
  @Type(() => ReferenceDetailsDto)
  referenceDetail?: ReferenceDetailsDto;
}

export class ContactUsDto {
  @ApiProperty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class CustomInquiryDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  inquiresFor: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  referenceImages?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  referenceLinks?: string[];

  @ApiProperty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class SendOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: OTP_TYPE })
  @IsEnum(OTP_TYPE)
  @IsNotEmpty()
  otpType: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  otp: number;
}

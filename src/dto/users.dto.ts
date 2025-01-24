import { IsEmail, IsString, MinLength } from 'class-validator';
export class userDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
  @IsString()
  @MinLength(8, { message: 'confirmPassword must be at least 8 characters' })
  confirmPassword: string;
}

export class loginDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
export class contactDto {
  @IsString()
  inquiryPurpose: string;
  @IsString()
  description: string;
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
  @IsString()
  organization: string;
  @IsString()
  phone: string;
  @IsString()
  message: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsEmail()
  email: string;

  @ApiProperty()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must be 8 characters long with minimum one Uppercase, lowercase and special character',
  })
  password: string;

  @ApiProperty()
  @MinLength(2)
  @MaxLength(25)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @MinLength(2)
  @MaxLength(25)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  accountVerificationCode: string;
}

export class SignupResponseDto {
  @ApiProperty()
  message: string;
}

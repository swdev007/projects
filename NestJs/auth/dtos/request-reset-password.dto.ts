import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class RequestResetPasswordDto {
  @ApiProperty()
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsEmail()
  email: string;

  checkIfAdmin = false;
}

export class RequestResetPasswordResponseDto {}

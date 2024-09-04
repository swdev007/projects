import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6)
  uniqueCode: string;

  @ApiProperty()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must be 8 characters long with minimum one Uppercase, lowercase and special character',
  })
  newPassword: string;
}

export class ResetPasswordResponseDto {}

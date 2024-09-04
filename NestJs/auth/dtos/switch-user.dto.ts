import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SwitchUserDto {
  @ApiProperty()
  @IsString()
  userId: string;
}

export class SwitchUserResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

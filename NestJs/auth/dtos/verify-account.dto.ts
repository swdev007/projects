import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}

export class VerifyAccountResponseDto {
  @ApiProperty()
  message: string;
}

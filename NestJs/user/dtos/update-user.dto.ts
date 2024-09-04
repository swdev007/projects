import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserModel } from 'src/models/user.model';

export class UpdateCurrentUserDto {
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

  @ApiProperty()
  @IsString()
  @IsOptional()
  zipCode = '';

  @ApiProperty()
  @IsString()
  @IsOptional()
  myStylist = '';

  @ApiProperty()
  @IsString()
  @IsOptional()
  notes: string | undefined = undefined;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber: string | undefined = undefined;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string | undefined = undefined;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  referralCode: string | undefined = undefined;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  @IsOptional()
  shoppingRecsUrl: string | undefined = undefined;
}

export class UpdateCurrentUserResponseDto {
  @ApiProperty()
  currentUser: UserModel;
}

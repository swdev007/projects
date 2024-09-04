import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { UserModel } from 'src/models/user.model';

export class GetUsers {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page = 1;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Max(50)
  limit = 20;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => (value || '').trim().toLowerCase())
  @IsString()
  search = '';

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => {
    return value === 'true' ? true : value === 'false' ? false : true;
  })
  isVerified: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  startDate = '';

  @ApiProperty()
  @IsOptional()
  @IsString()
  endDate = '';
}

export class GetUsersResponseDto {
  @ApiProperty()
  users: UserModel[];

  @ApiProperty()
  count: number;
}

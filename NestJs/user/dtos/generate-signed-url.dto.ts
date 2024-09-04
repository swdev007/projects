import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GenerateSignedUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  public content: string;

  @ApiProperty()
  @IsNotEmpty()
  public fileName: string;
}

export class GenerateSignedUrlResponseDto {
  @ApiProperty()
  public key: string;

  @ApiProperty()
  @IsNotEmpty()
  public contentUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  public signedUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  public originalUrl: string;
}

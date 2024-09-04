import { ApiProperty } from '@nestjs/swagger';

export class ImageModel {
  @ApiProperty()
  image: string;

  @ApiProperty()
  imageResized: string;

  @ApiProperty()
  imageLarge: string;

  constructor(image: string) {
    this.image = process.env.AWS_CLOUDFRONT + image;
    this.imageResized = process.env.AWS_CLOUDFRONT_RESIZED + image;
    this.imageLarge = process.env.AWS_CLOUDFRONT_RESIZED + 'large/' + image;
  }
}

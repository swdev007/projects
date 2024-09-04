import { ApiProperty } from '@nestjs/swagger';
import { Look } from 'src/looks/entities/look.entity';
import { ImageModel } from './image.model';

export class LookModel {
  @ApiProperty()
  notes: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  imageLarge: string;

  @ApiProperty()
  imageResized: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  isFavorite: boolean;

  @ApiProperty()
  isArchived: boolean;

  @ApiProperty()
  lastChooseDate: Date;

  @ApiProperty()
  archiveReason: string;

  @ApiProperty({ type: [ImageModel] })
  images: ImageModel[];

  constructor(data: Look) {
    this.id = data.id;
    this.image = process.env.AWS_CLOUDFRONT + data.image;
    this.imageResized = process.env.AWS_CLOUDFRONT_RESIZED + data.image;
    this.imageLarge =
      process.env.AWS_CLOUDFRONT_RESIZED + 'large/' + data.image;
    this.notes = data.notes;
    this.isFavorite = data.isFavorite;
    this.isArchived = data.isArchived;
    this.lastChooseDate = data.lastChooseDate;
    this.createdAt = data.createdAt;
    this.archiveReason = data.archiveReason || '';
    this.images = data?.images?.length
      ? data.images.map((ele) => new ImageModel(ele.image))
      : [];
  }
}

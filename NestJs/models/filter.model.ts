import { ApiProperty } from '@nestjs/swagger';

export class FilterModel {
  @ApiProperty()
  title: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  count = 0;

  constructor(data: any, count = 0) {
    this.id = data.id;
    this.title = data.title;
    this.count = +(data.count ?? count ?? 0);
  }
}

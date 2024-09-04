import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from 'src/models/user.model';

export class GetCurrentUserResponse {
  @ApiProperty()
  currentUser: UserModel;
}

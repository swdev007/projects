import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';
import { UserModel } from 'src/models/user.model';
import { GetCurrentUserResponse } from '../dtos/get-user.dto';
import { GetUsers, GetUsersResponseDto } from '../dtos/get-users.dto';
import { UserService } from '../services/user.service';

@ApiTags('User')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: 'Get All users',
  })
  @Get('check-admin')
  checkAdmin(): Promise<void> {
    return;
  }

  @ApiOperation({
    description: 'Get current user',
  })
  @ApiOkResponse({
    type: GetCurrentUserResponse,
  })
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<GetCurrentUserResponse> {
    const userData = await this.userService.getUser(id);
    return { currentUser: new UserModel(userData) };
  }

  @ApiOperation({
    description: 'Get All users',
  })
  @ApiOkResponse({
    type: GetUsersResponseDto,
  })
  @Get('')
  async getUsers(@Query() query: GetUsers): Promise<GetUsersResponseDto> {
    const [users, count] = await this.userService.getUsers(
      query.page,
      query.limit,
      query.search,
    );
    return { users, count };
  }
}

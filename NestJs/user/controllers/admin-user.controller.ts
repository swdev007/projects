import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';
import { AccountStatus } from 'src/core/account-status.enum';
import { ResponseMessagesEnum } from 'src/core/message.enums';
import { ShoppingCartModel } from 'src/models/shopping-cart.model';
import { UserModel } from 'src/models/user.model';
import { GetUser } from '../decorators/get-user.decorator';
import {
  GetShoppingCart,
  GetShoppingCartResponseDto,
} from '../dtos/get-shopping-cart.dto';
import { GetCurrentUserResponse } from '../dtos/get-user.dto';
import { GetUsers, GetUsersResponseDto } from '../dtos/get-users.dto';
import {
  UpdateCurrentUserDto,
  UpdateCurrentUserResponseDto,
} from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('Admin User')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
@Controller({ path: 'admin/user', version: '1' })
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

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
      query.isVerified,
      query.startDate,
      query.endDate,
    );
    return { users, count };
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
    description: 'Update user',
  })
  @ApiOkResponse({
    type: UpdateCurrentUserResponseDto,
  })
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateCurrentUserDto,
  ): Promise<UpdateCurrentUserResponseDto> {
    const userData = await this.userService.updateUser(id, updateDto);
    return { currentUser: new UserModel(userData) };
  }

  @ApiOperation({
    description: 'Freeze Account',
  })
  @ApiOkResponse({
    type: UpdateCurrentUserResponseDto,
  })
  @Post('freeze/:id')
  async freezeAccount(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<UpdateCurrentUserResponseDto> {
    if (user.id === id) {
      throw new BadRequestException(
        ResponseMessagesEnum.CAN_NOT_FREEZE_UNFREEZE,
      );
    }
    const userData = await this.userService.freezeOrUnFreezeAccount(
      id,
      AccountStatus.FREEZE,
    );
    return { currentUser: new UserModel(userData) };
  }

  @ApiOperation({
    description: 'Un freeze Account',
  })
  @ApiOkResponse({
    type: UpdateCurrentUserResponseDto,
  })
  @Post('unfreeze/:id')
  async unfreezeAccount(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<UpdateCurrentUserResponseDto> {
    if (user.id === id) {
      throw new BadRequestException(
        ResponseMessagesEnum.CAN_NOT_FREEZE_UNFREEZE,
      );
    }
    const userData = await this.userService.freezeOrUnFreezeAccount(
      id,
      AccountStatus.ACTIVE,
    );
    return { currentUser: new UserModel(userData) };
  }

  @ApiOperation({
    description: 'Get shopping cart',
  })
  @ApiOkResponse({
    type: UpdateCurrentUserResponseDto,
  })
  @Get('shopping-cart/:id')
  async getShoppingCard(
    @Param('id') id: string,
    @Query() query: GetShoppingCart,
  ): Promise<GetShoppingCartResponseDto> {
    const [data, count] = await this.userService.getShoppingCartForUser(
      id,
      query.page,
      query.limit,
    );
    return { shoppingCart: data.map((el) => new ShoppingCartModel(el)), count };
  }
}

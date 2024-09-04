import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { S3FileUploadService } from 'src/aws/s3-file-upload/s3-file-upload.service';
import { UserModel } from 'src/models/user.model';
import { GetUser } from '../decorators/get-user.decorator';
import { DeleteUserDto } from '../dtos/delete-user.dto';
import {
  GenerateSignedUrlDto,
  GenerateSignedUrlResponseDto,
} from '../dtos/generate-signed-url.dto';
import { GetCurrentUserResponse } from '../dtos/get-user.dto';
import {
  UpdateCurrentUserDto,
  UpdateCurrentUserResponseDto,
} from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('Current user')
@UseGuards(AuthGuard)
@Controller({ path: 'current-user', version: '1' })
@ApiBearerAuth()
export class CurrentUserController {
  constructor(
    private readonly userService: UserService,
    private readonly s3FileUploadService: S3FileUploadService,
  ) {}

  @ApiOperation({
    description: 'Get current user',
  })
  @ApiOkResponse({
    type: GetCurrentUserResponse,
  })
  @Get()
  async getUser(@GetUser() user: User): Promise<GetCurrentUserResponse> {
    const userData = await this.userService.getUser(user.id);
    return { currentUser: new UserModel(userData) };
  }

  @ApiOperation({
    description: 'Update current user',
  })
  @ApiOkResponse({
    type: UpdateCurrentUserResponseDto,
  })
  @Put()
  async updateUser(
    @GetUser() user: User,
    @Body() updateDto: UpdateCurrentUserDto,
  ): Promise<UpdateCurrentUserResponseDto> {
    const userData = await this.userService.updateUser(user.id, updateDto);
    return { currentUser: new UserModel(userData) };
  }

  @ApiOperation({
    description: 'Delete current user',
  })
  @ApiOkResponse({
    type: DeleteUserDto,
  })
  @Delete()
  async deleteCurrentUser(@GetUser() user: User): Promise<DeleteUserDto> {
    await this.userService.softDeleteUser(user.id);
    return { message: 'User deleted successfully' };
  }

  @ApiOperation({
    description: 'Generate signed url',
  })
  @ApiOkResponse({
    type: GenerateSignedUrlResponseDto,
  })
  @Post('signed-url')
  async generateSignedUrl(
    @Body() body: GenerateSignedUrlDto,
    @GetUser() user: User,
  ): Promise<GenerateSignedUrlResponseDto> {
    return this.s3FileUploadService.generatePresignedUrl({
      ...body,
      userId: user.id,
    });
  }
}

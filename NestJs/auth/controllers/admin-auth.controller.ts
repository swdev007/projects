import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import {
  RequestResetPasswordDto,
  RequestResetPasswordResponseDto,
} from '../dtos/request-reset-password.dto';
import {
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from '../dtos/reset-password.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Admin Auth')
@UsePipes(new ValidationPipe())
@Controller({
  path: 'auth/admin',
  version: '1',
})
export class AdminAuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    description: '[ADMIN] login Api',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @Post('login')
  adminLogin(@Body() loginBody: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login({ ...loginBody, checkIfAdmin: true });
  }

  @ApiOperation({
    description: '[ADMIN] Request password reset link on email',
  })
  @ApiOkResponse({
    type: RequestResetPasswordResponseDto,
  })
  @Post('request-reset-password')
  requestResetPassword(
    @Body() requestResetPasswordBody: RequestResetPasswordDto,
  ): Promise<void> {
    return this.authService.requestResetPassword(
      requestResetPasswordBody.email,
      true,
    );
  }

  @ApiOperation({
    description: '[ADMIN] Reset password',
  })
  @ApiOkResponse({
    type: ResetPasswordResponseDto,
  })
  @Post('reset-password')
  resetPassword(@Body() resetPasswordBody: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(
      resetPasswordBody.uniqueCode,
      resetPasswordBody.newPassword,
    );
  }
}

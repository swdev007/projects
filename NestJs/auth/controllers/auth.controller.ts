import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import {
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from '../dtos/refresh-token.dto';
import {
  RequestResetPasswordDto,
  RequestResetPasswordResponseDto,
} from '../dtos/request-reset-password.dto';
import {
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from '../dtos/reset-password.dto';
import { SignupDto, SignupResponseDto } from '../dtos/signup.dto';
import { SwitchUserResponseDto } from '../dtos/switch-user.dto';
import { VerifyAccountDto } from '../dtos/verify-account.dto';
import { AdminAuthGuard } from '../guards/admin.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@UsePipes(new ValidationPipe())
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    description: 'Signup using email',
  })
  @ApiOkResponse({
    type: SignupResponseDto,
  })
  @Post('signup')
  signup(@Body() signupBody: SignupDto): Promise<SignupResponseDto> {
    return this.authService.signup(signupBody);
  }

  @ApiOperation({
    description: 'Verify account using uuid and id',
  })
  @ApiOkResponse({
    type: String,
  })
  @Get('verify-account')
  async verifyAccount(
    @Query() verifyAccountQueryParams: VerifyAccountDto,
  ): Promise<string> {
    const { message } = await this.authService.verifyAccount(
      verifyAccountQueryParams,
    );
    return message;
  }

  @ApiOperation({
    description: 'Login using email',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @Post('login')
  login(@Body() loginBody: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginBody);
  }

  @ApiOperation({
    description: 'Request password reset link on email',
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
    );
  }

  @ApiOperation({
    description: 'Reset password',
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

  @ApiOperation({
    description: 'Refresh access token',
  })
  @ApiOkResponse({
    type: RefreshTokenResponseDto,
  })
  @Post('refresh')
  generateCredentialsBasedOnRefreshToken(
    @Body() refreshTokenBody: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.authService.generateCredentialsBasedOnRefreshToken(
      refreshTokenBody.refreshToken,
    );
  }

  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    description: 'Switch user',
  })
  @ApiOkResponse({
    type: SwitchUserResponseDto,
  })
  @ApiBearerAuth()
  @Post('switch-user/:id')
  switchUser(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<SwitchUserResponseDto> {
    return this.authService.switchUserBasedOnSelectedUser(user.id, id);
  }
}

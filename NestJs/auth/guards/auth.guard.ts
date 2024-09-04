import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccountStatus } from 'src/core/account-status.enum';
import { FreezeAccountException } from 'src/core/exceptions/FreezeAccount';
import { UserNotFoundException } from 'src/core/exceptions/UserNotFound';
import { UserRepository } from 'src/user/repository/user.repository';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request): Promise<boolean> {
    const accessToken = request.headers?.authorization?.replace('Bearer ', '');
    try {
      const user = await this.jwtService.verifyAccessToken(accessToken);
      if (!accessToken || !user) {
        return false;
      }
      if (user?.isAdmin === true) {
        user.id = user.selectedUserId;
      }
      const userDetails = await this.userRepository.findUser({ id: user.id });
      if (!userDetails) {
        throw new UserNotFoundException();
      }

      if (userDetails.accountStatus === AccountStatus.FREEZE) {
        throw new FreezeAccountException();
      }
      if (userDetails) {
        request.userDetails = userDetails;
        return true;
      }
      return false;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

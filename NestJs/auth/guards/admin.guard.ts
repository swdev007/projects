import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleType } from 'src/core/role.enums';
import { UserRepository } from 'src/user/repository/user.repository';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
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
      const userDetails = await this.userRepository.findUser({ id: user.id });
      if (userDetails && userDetails.role === RoleType.ADMIN) {
        request.userDetails = userDetails;
        return true;
      }
      return false;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext): User => {
    return context.switchToHttp().getRequest().userDetails;
  },
);

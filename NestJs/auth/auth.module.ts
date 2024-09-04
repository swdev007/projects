import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'src/aws/email/email.service';
import { TypeOrmExModule } from 'src/core/database/typeorm-ex.module';
import { LookFilterMappingRepository } from 'src/looks/repositories/look-filter-mapping.repository';
import { LookRepository } from 'src/looks/repositories/look.repository';
import { ShoppingCartRepository } from 'src/shopping-cart/repositories/shopping-card.repository';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user.repository';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { BcryptService } from './services/bcrypt.service';
import { JwtService } from './services/jwt.service';

const repositories = [
  UserRepository,
  LookFilterMappingRepository,
  LookRepository,
  ShoppingCartRepository,
];

const entities = [User];
@Module({
  imports: [
    TypeOrmModule.forFeature([...entities]),
    TypeOrmExModule.forCustomRepository([...repositories]),
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService, BcryptService, JwtService, AuthGuard, EmailService],
})
export class AuthModule {}

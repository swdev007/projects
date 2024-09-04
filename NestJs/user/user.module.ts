import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtService } from 'src/auth/services/jwt.service';
import { S3FileUploadService } from 'src/aws/s3-file-upload/s3-file-upload.service';
import { TypeOrmExModule } from 'src/core/database/typeorm-ex.module';
import { UserGateway } from 'src/gateway/user.gateway';
import { ShoppingCartRepository } from 'src/shopping-cart/repositories/shopping-card.repository';
import { AdminUserController } from './controllers/admin-user.controller';
import { CurrentUserController } from './controllers/current-user.controller';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserService } from './services/user.service';

const repositories = [UserRepository, ShoppingCartRepository];

const entities = [User];

@Module({
  imports: [
    TypeOrmModule.forFeature([...entities]),
    TypeOrmExModule.forCustomRepository([...repositories]),
  ],
  controllers: [UserController, CurrentUserController, AdminUserController],
  providers: [
    UserService,
    AuthGuard,
    JwtService,
    S3FileUploadService,
    AdminAuthGuard,
    UserGateway,
  ],
})
export class UserModule {}

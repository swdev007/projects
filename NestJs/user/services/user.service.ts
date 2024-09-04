import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatus } from 'src/core/account-status.enum';
import { UserNotFoundException } from 'src/core/exceptions/UserNotFound';
import { UserGateway } from 'src/gateway/user.gateway';
import { UserModel } from 'src/models/user.model';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';
import { ShoppingCartRepository } from 'src/shopping-cart/repositories/shopping-card.repository';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @Inject(UserGateway)
    private readonly userGateway: UserGateway,

    @InjectRepository(ShoppingCartRepository)
    private readonly shoppingCartRepository: ShoppingCartRepository,
  ) {}

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findUser({ id: id });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async updateUser(id: string, fields: Partial<User>): Promise<User> {
    await this.userRepository.updateUser(id, fields);
    return this.getUser(id);
  }

  async softDeleteUser(id: string): Promise<void> {
    await this.getUser(id);
    await this.userGateway.emitAccountDeleted(id);
    await this.userRepository.softDeleteUser(id);
  }
  async getUsers(
    page: number,
    limit: number,
    search: string,
    isVerified = true,
    startDate = '',
    endDate = '',
  ): Promise<[UserModel[], number]> {
    const [user, count] = await this.userRepository.findUsers(
      page,
      limit,
      search,
      isVerified,
      startDate,
      endDate,
    );

    return [user.map((el) => new UserModel(el)), count];
  }

  async freezeOrUnFreezeAccount(
    id: string,
    accountStatus: AccountStatus,
  ): Promise<User> {
    await this.userRepository.updateUser(id, {
      accountStatus,
    });

    await this.userGateway.emitAccountFrozen(id);
    // add websocket call here
    return this.getUser(id);
  }

  async getShoppingCartForUser(
    id: string,
    page = 1,
    limit = 20,
  ): Promise<[ShoppingCart[], number]> {
    return this.shoppingCartRepository.getShoppingCart(id, page, limit);
  }
}

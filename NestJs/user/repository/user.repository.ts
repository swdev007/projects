import { AccountStatus } from 'src/core/account-status.enum';
import { CustomRepository } from 'src/core/database/typeorm-ex.decorator';
import { UserModel } from 'src/models/user.model';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(data: Partial<UserModel>): Promise<User> {
    return this.save(data);
  }

  async findUser(data: Partial<UserModel>): Promise<User> {
    return this.findOne({ where: { ...data } });
  }

  async findDeletedUser(data: Partial<UserModel>): Promise<User> {
    return this.findOne({ where: { ...data }, withDeleted: true });
  }

  async updateUser(
    id: string,
    data: Partial<UserModel | User>,
  ): Promise<DeleteResult> {
    return this.update(id, { ...data });
  }

  async softDeleteUser(id: string): Promise<DeleteResult> {
    return this.softDelete(id);
  }

  async hardDeleteUser(id: string): Promise<DeleteResult> {
    return this.delete(id);
  }

  async findUsers(
    page: number,
    limit: number,
    search: string,
    isVerified: boolean,
    startDate: string,
    endDate: string,
  ): Promise<[User[], number]> {
    const query = this.createQueryBuilder('u').where(`
      (CONCAT(u.first_name, ' ', u.last_name) ILIKE '%${search}%' or u.email ILIKE '%${search}%')
    `);

    if (isVerified) {
      query.andWhere(`u.account_verified = true`);
      query.andWhere(`u.account_status = '${AccountStatus.ACTIVE}'`);
    }

    if (startDate && endDate) {
      query.andWhere('u.created_at >= :start_at', {
        start_at: startDate,
      });
      query.andWhere('u.created_at <= :end_at', {
        end_at: endDate,
      });
    }

    query.skip((page - 1) * limit);
    query.take(limit);
    query.orderBy(`u.created_at`, 'DESC');
    // query.orderBy(`u.first_name`, 'ASC');
    // query.addOrderBy(`u.last_name`, 'ASC');

    return query.getManyAndCount();
  }
}

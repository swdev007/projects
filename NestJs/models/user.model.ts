import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus } from 'src/core/account-status.enum';
import { RoleType } from 'src/core/role.enums';
import { User } from 'src/user/entities/user.entity';

export class UserModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  zipCode: string | null;

  @ApiProperty()
  myStylist: string | null;

  @ApiPropertyOptional()
  resetPasswordUniqueCode: string | null;

  @ApiPropertyOptional()
  isAdmin: boolean;

  @ApiProperty()
  accountVerified: boolean;

  @ApiProperty()
  notes: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  address: string;

  @ApiProperty()
  referralCode: string;

  @ApiProperty()
  shoppingRecsUrl: string;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.zipCode = user.zipCode;
    this.myStylist = user.myStylist;
    this.resetPasswordUniqueCode = user.resetPasswordUniqueCode;
    this.isAdmin = user.role === RoleType.ADMIN;
    this.accountVerified = user.accountVerified;
    this.notes = user.notes;
    this.phoneNumber = user.phoneNumber;
    this.isActive = user.accountStatus === AccountStatus.ACTIVE;
    this.address = user.address;
    this.createdAt = user.createdAt;
    this.referralCode = user.referralCode || '';
    this.shoppingRecsUrl = user.shoppingRecsUrl || '';
  }

  static ObjectForJWt(user: User, userId?: string): object {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      resetPasswordUniqueCode: user.resetPasswordUniqueCode,
      isAdmin: user.role === RoleType.ADMIN,
      selectedUserId: user.role === RoleType.ADMIN && userId ? userId : user.id,
    };
  }
}

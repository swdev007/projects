import { AccountStatus } from 'src/core/account-status.enum';
import { CustomBaseEntity } from 'src/core/base.entity';
import { RoleType } from 'src/core/role.enums';
import { LookFilterMapping } from 'src/looks/entities/look-filter-mapping.entity';
import { Look } from 'src/looks/entities/look.entity';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('user')
export class User extends CustomBaseEntity {
  @Column({ name: 'email', length: 100, nullable: true, unique: true })
  public email: string;

  @Column({ name: 'password', type: 'text', nullable: false })
  public password: string;

  @Column({ name: 'first_name', length: 100, nullable: true })
  public firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  public lastName: string;

  @Column({ name: 'account_verified', type: 'boolean', default: false })
  public accountVerified: boolean;

  @Column({
    name: 'account_verification_code',
    type: 'uuid',
    nullable: true,
  })
  public accountVerificationCode: string;

  @Column({
    name: 'reset_password_unique_code',
    length: 6,
    nullable: true,
    unique: false,
  })
  public resetPasswordUniqueCode: string;

  @Column({
    name: 'zip_code',
    length: 100,
    nullable: true,
    unique: false,
  })
  public zipCode: string;

  @Column({
    name: 'my_stylist',
    length: 100,
    nullable: true,
    unique: false,
  })
  public myStylist: string;

  @OneToMany(() => Look, (look) => look.user)
  public looks: Look[];

  @OneToMany(
    () => LookFilterMapping,
    (lookFilterMapping) => lookFilterMapping.user,
  )
  public lookFilterMapping: LookFilterMapping[];

  @Column({
    name: 'role',
    type: 'enum',
    enum: RoleType,
    nullable: false,
    default: RoleType.USER,
  })
  role: RoleType;

  @Column({ name: 'notes', type: 'text', nullable: true })
  public notes: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  public address: string;

  @Column({
    name: 'phone_number',
    length: 100,
    nullable: true,
    unique: false,
  })
  public phoneNumber: string;

  @Column({
    name: 'referral_code',
    length: 100,
    nullable: true,
    unique: false,
  })
  public referralCode: string;

  @Column({
    name: 'account_status',
    type: 'enum',
    enum: AccountStatus,
    nullable: false,
    default: AccountStatus.ACTIVE,
  })
  accountStatus: AccountStatus;

  @Column({
    name: 'shopping_recs_url',
    type: 'text',
    nullable: true,
    default: '',
  })
  shoppingRecsUrl: string;

  @OneToMany(() => ShoppingCart, (shoppingCart) => shoppingCart.user)
  public shoppingCart: ShoppingCart[];
}

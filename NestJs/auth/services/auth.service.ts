import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/aws/email/email.service';
import { AccountStatus } from 'src/core/account-status.enum';
import { FreezeAccountException } from 'src/core/exceptions/FreezeAccount';
import { UserNotFoundException } from 'src/core/exceptions/UserNotFound';
import { ResponseMessagesEnum } from 'src/core/message.enums';
import { RoleType } from 'src/core/role.enums';
import { LookFilterMappingRepository } from 'src/looks/repositories/look-filter-mapping.repository';
import { LookRepository } from 'src/looks/repositories/look.repository';
import { CredentialsModel } from 'src/models/credentials.model';
import { MessageModel } from 'src/models/message.model';
import { UserModel } from 'src/models/user.model';
import { ShoppingCartRepository } from 'src/shopping-cart/repositories/shopping-card.repository';
import { UserRepository } from 'src/user/repository/user.repository';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from '../dtos/login.dto';
import { SignupDto } from '../dtos/signup.dto';
import { VerifyAccountDto } from '../dtos/verify-account.dto';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    private readonly bcryptService: BcryptService,

    private readonly emailService: EmailService,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(LookFilterMappingRepository)
    private readonly lookFilterMappingRepository: LookFilterMappingRepository,

    @InjectRepository(LookRepository)
    private readonly lookRepository: LookRepository,

    @InjectRepository(ShoppingCartRepository)
    private readonly shoppingCartRepository: ShoppingCartRepository,
  ) {}

  async signup(signupBody: SignupDto): Promise<MessageModel> {
    //check if user exists in the database based on email
    const { email } = signupBody;
    const existingUser = await this.userRepository.findUser({ email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // check if user email is already present in deleted entries
    const deletedUser = await this.userRepository.findDeletedUser({ email });

    // delete user
    if (deletedUser) {
      // delete user filters
      await this.lookFilterMappingRepository.hardDeleteLookFilterMapping(
        deletedUser.id,
      );
      // delete looks
      await this.lookRepository.hardDeleteLooks(deletedUser.id);

      // delete shopping cart
      await this.shoppingCartRepository.hardDeleteCart(deletedUser.id);

      //delete User
      await this.userRepository.hardDeleteUser(deletedUser.id);
    }

    // encode password
    signupBody.password = await this.bcryptService.hash(signupBody.password);

    signupBody.accountVerificationCode = uuidv4();

    // create a user
    const user = await this.userRepository.createUser(signupBody);

    // send email to user to verify account
    try {
      await this.emailService.sendEmailVerificationCode(
        user.id,
        user.accountVerificationCode,
        user.email,
      );
    } catch (error) {
      console.log(error);
    }

    return new MessageModel(ResponseMessagesEnum.VERIFY_ACCOUNT_TO_CONTINUE);
  }

  async verifyAccount(
    verifyAccountQueryParams: VerifyAccountDto,
  ): Promise<MessageModel> {
    const { uuid, id } = verifyAccountQueryParams;
    const user = await this.userRepository.findUser({ id });
    if (user.accountVerified) {
      return new MessageModel(ResponseMessagesEnum.ACCOUNT_VERIFIED);
    }
    if (user.accountVerificationCode !== uuid) {
      throw new BadRequestException('Invalid verification code');
    }
    user.accountVerified = true;
    user.accountVerificationCode = null;
    await this.userRepository.updateUser(id, { ...user });
    await this.userRepository.findUser({ id });
    return new MessageModel(ResponseMessagesEnum.ACCOUNT_VERIFIED_SUCCESSFULLY);
  }

  async login(loginBody: LoginDto): Promise<CredentialsModel> {
    const { email, password, checkIfAdmin } = loginBody;

    //check if user exists in the database based on email
    const existingUser = await this.userRepository.findUser({ email });
    if (!existingUser) {
      throw new UserNotFoundException();
    }

    if (existingUser?.accountStatus === AccountStatus.FREEZE) {
      throw new FreezeAccountException();
    }

    // match password using bcrypt
    const isPasswordMatched = await this.bcryptService.compare(
      password,
      existingUser.password,
    );

    // throw error if password does not match
    if (!isPasswordMatched) {
      throw new BadRequestException(
        ResponseMessagesEnum.PASSWORD_OR_EMAIL_NOT_VALID,
      );
    }

    // is check if account is verified
    if (!existingUser.accountVerified) {
      throw new BadRequestException(
        ResponseMessagesEnum.VERIFY_ACCOUNT_TO_CONTINUE,
      );
    }

    if (checkIfAdmin && existingUser.role !== RoleType.ADMIN) {
      throw new BadRequestException(ResponseMessagesEnum.ONLY_ADMIN_ACCESS);
    }

    // return credentials
    const credentials = this.jwtService.encode(
      UserModel.ObjectForJWt(existingUser),
    );
    return new CredentialsModel(credentials);
  }

  async resetPassword(
    resetPasswordUniqueCode: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findUser({
      resetPasswordUniqueCode,
    });

    if (!user) {
      throw new BadRequestException(ResponseMessagesEnum.CODE_EXPIRED);
    }
    // Mark unique case as null
    user.resetPasswordUniqueCode = null;

    // Encrypt password and save to database
    user.password = await this.bcryptService.hash(newPassword);

    // Update new password to the database
    await this.userRepository.updateUser(user.id, user);
  }

  async requestResetPassword(
    email: string,
    checkIfAdmin = false,
  ): Promise<void> {
    // check if user exists
    const user = await this.userRepository.findUser({
      email,
    });
    if (!user) {
      throw new UserNotFoundException();
    }

    if (checkIfAdmin && user.role !== RoleType.ADMIN) {
      throw new BadRequestException(ResponseMessagesEnum.ONLY_ADMIN_ACCESS);
    }

    // Add a unique id to user
    user.resetPasswordUniqueCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    try {
      await this.emailService.sendResetPasswordEmail(
        user.email,
        user.resetPasswordUniqueCode,
      );
    } catch (error) {
      console.log(error);
    }

    // Save user to DB
    await this.userRepository.updateUser(user.id, user);
  }

  async generateCredentialsBasedOnRefreshToken(
    refreshToken,
  ): Promise<CredentialsModel> {
    try {
      // decode and verify refresh token
      const user = await this.jwtService.verifyRefreshToken(refreshToken);
      if (!refreshToken || !user) {
        throw new BadRequestException(
          ResponseMessagesEnum.CAN_NOT_PERFORM_THIS_ACTION,
        );
      }

      // get user details from database
      const userDetails = await this.userRepository.findUser({ id: user.id });

      if (!userDetails) {
        throw new ForbiddenException(FORBIDDEN_MESSAGE);
      }
      if (userDetails.accountStatus === AccountStatus.FREEZE) {
        throw new FreezeAccountException();
      }

      // create credentials and return
      const credentials = this.jwtService.encode(
        UserModel.ObjectForJWt(userDetails),
      );
      return new CredentialsModel(credentials);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async switchUserBasedOnSelectedUser(
    userId,
    selectedId: string,
  ): Promise<CredentialsModel> {
    try {
      // get user details from database
      const userDetails = await this.userRepository.findUser({ id: userId });

      const userToBeSelected = await this.userRepository.findUser({
        id: selectedId,
      });

      if (!userToBeSelected) {
        throw new UserNotFoundException();
      }

      if (userToBeSelected.accountStatus === AccountStatus.FREEZE) {
        throw new FreezeAccountException();
      }

      // create credentials and return
      const credentials = this.jwtService.encode(
        UserModel.ObjectForJWt(userDetails, userToBeSelected.id),
      );
      return new CredentialsModel(credentials);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

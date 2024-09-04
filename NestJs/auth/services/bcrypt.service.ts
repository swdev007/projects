import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS);
    return bcrypt.hash(plainText, salt);
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}

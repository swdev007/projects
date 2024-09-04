import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  encode(payload: object): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  decode(token: string): any {
    return jwt.decode(token);
  }

  verifyAccessToken(accessToken: string): any {
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  }

  verifyRefreshToken(refreshToken: string): any {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  }
}

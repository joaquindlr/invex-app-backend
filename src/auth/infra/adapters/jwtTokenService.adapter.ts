import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  TokenServicePort,
  SignTokenPayload,
} from '../../application/ports/tokenService.port';

@Injectable()
export class JwtTokenServiceAdapter implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  signToken(payload: SignTokenPayload): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}

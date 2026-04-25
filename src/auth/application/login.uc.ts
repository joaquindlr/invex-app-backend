import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../users/domain/user.repository';
import { PasswordHasherPort } from '../../users/application/ports/passwordHasher.port';
import { TokenServicePort } from './ports/tokenService.port';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(email: string, passwordPlain: string) {
    // 1. Buscar usuario
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Validar contraseña
    const isMatch = await this.passwordHasher.compare(
      passwordPlain,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generar Token
    const token = this.tokenService.signToken({
      sub: user.id,
      email: user.email,
    });

    return { accessToken: token };
  }
}

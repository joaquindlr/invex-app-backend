import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './infra/web/auth.controller';
import { LoginUseCase } from './application/login.uc';
import { TokenServicePort } from './application/ports/tokenService.port';
import { JwtTokenServiceAdapter } from './infra/adapters/jwtTokenService.adapter';
import { JwtStrategy } from './infra/strategies/jwt.strategie';
import { GetMeUseCase } from './application/getMe.uc';
import { BusinessesModule } from 'src/businesses/businesses.module';

@Module({
  imports: [
    UsersModule,
    BusinessesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    GetMeUseCase,
    JwtStrategy,
    {
      provide: TokenServicePort,
      useClass: JwtTokenServiceAdapter,
    },
  ],
  exports: [JwtStrategy, JwtModule],
})
export class AuthModule {}

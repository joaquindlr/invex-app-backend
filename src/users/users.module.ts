import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './infra/web/user.controller';
import { CreateUserUseCase } from './application/createUser.uc';
import { UserRepository } from './domain/user.repository';
import { UserEntity } from './infra/persistence/user.entity';
import { UserRepositoryImpl } from './infra/persistence/user.repositoryImpl';
import { GetUserByEmailUseCase } from './application/getUserByEmail.uc';
import { PasswordHasherPort } from './application/ports/passwordHasher.port';
import { BcryptPasswordHasher } from './infra/adapters/bcryptPasswordHasher.adapter';
import { PlanProvisioningEntity } from './infra/persistence/planProvisioning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PlanProvisioningEntity])],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    GetUserByEmailUseCase,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: PasswordHasherPort,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [
    CreateUserUseCase,
    GetUserByEmailUseCase,
    UserRepository,
    PasswordHasherPort,
  ],
})
export class UsersModule {}

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.model';
import { v4 as uuidv4 } from 'uuid';
import { PasswordHasherPort } from './ports/passwordHasher.port';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanProvisioningEntity } from '../infra/persistence/planProvisioning.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasherPort,
    @InjectRepository(PlanProvisioningEntity)
    private readonly provisioningRepo: Repository<PlanProvisioningEntity>,
  ) {}

  async execute(
    email: string,
    fullName: string,
    passwordPlain: string,
  ): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error('El usuario ya existe');
    }

    const provisioning = await this.provisioningRepo.findOne({
      where: { email: email.toLowerCase() },
    });

    let allowedBusinesses = 0;

    if (provisioning) {
      allowedBusinesses = provisioning.maxAllowedBusinesses;

      provisioning.isClaimed = true;
      await this.provisioningRepo.save(provisioning);
    }

    const passwordHash = await this.passwordHasher.hash(passwordPlain);

    const newUser = new User(
      uuidv4(),
      email,
      passwordHash,
      fullName,
      new Date(),
      allowedBusinesses,
    );

    await this.userRepo.save(newUser);

    return newUser;
  }
}

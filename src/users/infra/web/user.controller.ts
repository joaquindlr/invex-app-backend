import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/createUser.uc';
import { GetUserByEmailUseCase } from 'src/users/application/getUserByEmail.uc';
import { User } from '../../domain/user.model';
import { CreateUserDto } from './createUser.dto';
import { JwtAuthGuard } from 'src/auth/infra/guards/jwtAuth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(
      dto.email,
      dto.fullName,
      dto.password,
    );
    return this.sanitize(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.getUserByEmailUseCase.execute(email);
    return this.sanitize(user);
  }

  private sanitize(user: User): Omit<User, 'passwordHash'> {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
      maxAllowedBusinesses: user.maxAllowedBusinesses,
    };
  }
}

import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/createUser.uc';
import { GetUserByEmailUseCase } from 'src/users/application/getUserByEmail.uc';
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
    return this.createUserUseCase.execute(
      dto.email,
      dto.fullName,
      dto.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return this.getUserByEmailUseCase.execute(email);
  }
}

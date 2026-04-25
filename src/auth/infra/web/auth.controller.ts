import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../../application/login.uc';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.email, dto.password);
  }
}

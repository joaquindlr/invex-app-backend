import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LoginUseCase } from '../../application/login.uc';
import { LoginDto } from './login.dto';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { GetMeUseCase } from '../../application/getMe.uc';
import type { RequestWithUser } from './requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: RequestWithUser) {
    return this.getMeUseCase.execute(req.user.userId);
  }
}

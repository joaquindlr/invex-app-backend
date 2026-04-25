import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwtAuth.guard';
import { CreateBusinessUseCase } from '../../application/createBusiness.uc';
import { CreateBusinessDto } from './createBusiness.dto';
import type { RequestWithUser } from 'src/auth/infra/web/requestWithUser.interface';
import { GetUserBusinessesUseCase } from 'src/businesses/application/getUserBusiness.uc';

@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessesController {
  constructor(
    private readonly createBusinessUseCase: CreateBusinessUseCase,
    private readonly getUserBusinessesUseCase: GetUserBusinessesUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateBusinessDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.createBusinessUseCase.execute(userId, dto.name);
  }

  @Get()
  async getMyBusinesses(@Request() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.getUserBusinessesUseCase.execute(userId);
  }
}

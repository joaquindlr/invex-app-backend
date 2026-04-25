import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infra/guards/jwtAuth.guard';
import { CreateMovementUseCase } from 'src/movements/application/createMovement.uc';
import { CreateMovementDto } from './createMovements.dto';
import type { RequestWithUser } from 'src/auth/infra/web/requestWithUser.interface';
import { GetMovementsDto } from './getMovements.dto';
import { GetMovementsUseCase } from 'src/movements/application/getMovements.uc';

@Controller('movements')
export class MovementsController {
  constructor(
    private readonly createMovementUseCase: CreateMovementUseCase,
    private readonly getMovementsUseCase: GetMovementsUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateMovementDto, @Req() req: RequestWithUser) {
    return this.createMovementUseCase.execute(
      req.user.userId,
      dto.productId,
      dto.type,
      dto.quantity,
      dto.notes,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: GetMovementsDto, @Req() req: RequestWithUser) {
    return this.getMovementsUseCase.execute(
      req.user.userId,
      query.productId,
      query.page || 1,
      query.limit || 10,
    );
  }
}

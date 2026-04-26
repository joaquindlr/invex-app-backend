import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infra/guards/jwtAuth.guard';
import { AddVariantUseCase } from 'src/products/application/addVariant.uc';
import { UpdateVariantUseCase } from 'src/products/application/updateVariant.uc';
import { DeleteVariantUseCase } from 'src/products/application/deleteVariant.uc';
import { CreateVariantDto, UpdateVariantDto } from './variant.dto';
import type { RequestWithUser } from 'src/auth/infra/web/requestWithUser.interface';

@Controller()
@UseGuards(JwtAuthGuard)
export class VariantsController {
  constructor(
    private readonly addVariantUseCase: AddVariantUseCase,
    private readonly updateVariantUseCase: UpdateVariantUseCase,
    private readonly deleteVariantUseCase: DeleteVariantUseCase,
  ) {}

  @Post('products/:productId/variants')
  async addVariant(
    @Param('productId') productId: string,
    @Body() dto: CreateVariantDto,
    @Req() req: RequestWithUser,
  ) {
    return this.addVariantUseCase.execute(req.user.userId, productId, dto);
  }

  @Patch('variants/:variantId')
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
    @Req() req: RequestWithUser,
  ) {
    return this.updateVariantUseCase.execute(req.user.userId, variantId, dto);
  }

  @Delete('variants/:variantId')
  async deleteVariant(
    @Param('variantId') variantId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.deleteVariantUseCase.execute(req.user.userId, variantId);
  }
}

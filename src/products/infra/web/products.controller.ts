import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infra/guards/jwtAuth.guard';
import { CreateProductUseCase } from 'src/products/application/createProduct.uc';
import { CreateProductDto } from './createProduct.dto';
import type { RequestWithUser } from 'src/auth/infra/web/requestWithUser.interface';
import { GetProductsUseCase } from 'src/products/application/getProducts.uc';
import { GetProductsDto } from './getProducts.dto';
import { UpdateProductUseCase } from 'src/products/application/updateProduct.uc';
import { UpdateProductDto } from './updateProduct.dto';
import { GetProductUseCase } from 'src/products/application/getProduct.uc';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto, @Request() req: RequestWithUser) {
    const userId = req.user.userId;

    return this.createProductUseCase.execute(userId, dto);
  }

  @Get()
  async findAll(@Query() query: GetProductsDto, @Req() req: RequestWithUser) {
    const userId = req.user.userId;

    return this.getProductsUseCase.execute(
      userId,
      query.businessId,
      query.page || 1,
      query.limit || 10,
      query.categoryId,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: RequestWithUser,
  ) {
    return this.updateProductUseCase.execute(req.user.userId, id, dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.getProductUseCase.execute(id, userId);
  }
}

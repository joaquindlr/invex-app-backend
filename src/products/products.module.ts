import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './infra/persistence/product.entity';
import { ProductsController } from './infra/web/products.controller';
import { ProductRepository } from './infra/persistence/product.repository';
import { CreateProductUseCase } from './application/createProduct.uc';
import { BusinessesModule } from 'src/businesses/businesses.module';
import { GetProductsUseCase } from './application/getProducts.uc';
import { UpdateProductUseCase } from './application/updateProduct.uc';
import { GetProductUseCase } from './application/getProduct.uc';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), BusinessesModule],
  controllers: [ProductsController],
  providers: [
    ProductRepository,
    CreateProductUseCase,
    GetProductsUseCase,
    UpdateProductUseCase,
    GetProductUseCase,
  ],
})
export class ProductsModule {}

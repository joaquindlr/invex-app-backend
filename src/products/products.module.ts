import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './infra/persistence/product.entity';
import { ProductVariantEntity } from './infra/persistence/productVariant.entity';
import { ProductsController } from './infra/web/products.controller';
import { VariantsController } from './infra/web/variants.controller';
import { ProductRepository } from './infra/persistence/product.repository';
import { CreateProductUseCase } from './application/createProduct.uc';
import { BusinessesModule } from 'src/businesses/businesses.module';
import { GetProductsUseCase } from './application/getProducts.uc';
import { UpdateProductUseCase } from './application/updateProduct.uc';
import { GetProductUseCase } from './application/getProduct.uc';
import { AddVariantUseCase } from './application/addVariant.uc';
import { UpdateVariantUseCase } from './application/updateVariant.uc';
import { DeleteVariantUseCase } from './application/deleteVariant.uc';
import { DeleteProductUseCase } from './application/deleteProduct.uc';
import { ProductTypeOrmRepository } from './infra/persistence/product.typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductVariantEntity]),
    BusinessesModule,
  ],
  controllers: [ProductsController, VariantsController],
  providers: [
    ProductRepository,
    CreateProductUseCase,
    GetProductsUseCase,
    UpdateProductUseCase,
    GetProductUseCase,
    AddVariantUseCase,
    UpdateVariantUseCase,
    DeleteVariantUseCase,
    DeleteProductUseCase,
    {
      provide: 'I_PRODUCT_REPOSITORY',
      useClass: ProductTypeOrmRepository,
    },
  ],
})
export class ProductsModule {}

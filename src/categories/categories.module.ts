import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './infra/persistence/category.entity';
import { CategoriesController } from './infra/web/categories.controller';
import { CategoryRepository } from './infra/persistence/category.repository';
import { CreateCategoryUseCase } from './application/createCategory.uc';
import { GetCategoriesByBusinessUseCase } from './application/getCategoriesByBusiness.uc';
import { GetCategoryUseCase } from './application/getCategory.uc';
import { UpdateCategoryUseCase } from './application/updateCategory.uc';
import { DeleteCategoryUseCase } from './application/deleteCategory.uc';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoriesController],
  providers: [
    CategoryRepository,
    CreateCategoryUseCase,
    GetCategoriesByBusinessUseCase,
    GetCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
  exports: [
    CategoryRepository,
    GetCategoryUseCase, // Export common use cases if needed
  ],
})
export class CategoriesModule {}

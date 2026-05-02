import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../infra/persistence/category.repository';
import { CategoryEntity } from '../infra/persistence/category.entity';
import { UpdateCategoryDto } from '../infra/web/dto/update-category.dto';
import { GetCategoryUseCase } from './getCategory.uc';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    private readonly repository: CategoryRepository,
    private readonly getCategoryUseCase: GetCategoryUseCase,
  ) {}

  async execute(
    id: string,
    businessId: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.getCategoryUseCase.execute(id, businessId);
    Object.assign(category, dto);
    return await this.repository.save(category);
  }
}

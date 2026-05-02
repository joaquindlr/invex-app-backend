import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../infra/persistence/category.repository';
import { CategoryEntity } from '../infra/persistence/category.entity';

@Injectable()
export class GetCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string, businessId: string): Promise<CategoryEntity> {
    const category = await this.repository.findOne(id, businessId);
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }
}

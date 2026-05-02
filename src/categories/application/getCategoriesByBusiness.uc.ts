import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../infra/persistence/category.repository';
import { CategoryEntity } from '../infra/persistence/category.entity';

@Injectable()
export class GetCategoriesByBusinessUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(businessId: string): Promise<CategoryEntity[]> {
    return await this.repository.findAllByBusiness(businessId);
  }
}

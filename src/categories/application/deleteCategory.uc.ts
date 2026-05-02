import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../infra/persistence/category.repository';
import { GetCategoryUseCase } from './getCategory.uc';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    private readonly repository: CategoryRepository,
    private readonly getCategoryUseCase: GetCategoryUseCase,
  ) {}

  async execute(id: string, businessId: string): Promise<void> {
    const category = await this.getCategoryUseCase.execute(id, businessId);
    await this.repository.softDelete(category);
  }
}

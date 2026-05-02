import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../infra/persistence/category.repository';
import { CreateCategoryDto } from '../infra/web/dto/create-category.dto';
import { CategoryEntity } from '../infra/persistence/category.entity';

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryEntity> {
    return await this.repository.create(dto);
  }
}

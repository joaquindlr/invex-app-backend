import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  async create(category: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const newCategory = this.repository.create(category);
    return await this.repository.save(newCategory);
  }

  async findAllByBusiness(businessId: string): Promise<CategoryEntity[]> {
    return await this.repository.find({
      where: { businessId },
    });
  }

  async findOne(
    id: string,
    businessId: string,
  ): Promise<CategoryEntity | null> {
    return await this.repository.findOne({
      where: { id, businessId },
    });
  }

  async save(category: CategoryEntity): Promise<CategoryEntity> {
    return await this.repository.save(category);
  }

  async softDelete(category: CategoryEntity): Promise<void> {
    await this.repository.softRemove(category);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async create(data: Partial<ProductEntity>): Promise<ProductEntity> {
    const product = this.repo.create(data);
    return this.repo.save(product);
  }

  async findAllByBusiness(
    businessId: string,
    skip: number,
    limit: number,
  ): Promise<{ products: ProductEntity[]; total: number }> {
    const [products, total] = await this.repo.findAndCount({
      where: { businessId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
      relations: ['variants'],
    });

    return { products, total };
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['variants'],
    });
  }

  async update(
    id: string,
    data: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    const product = await this.repo.preload({
      id,
      ...data,
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return this.repo.save(product);
  }

  async preload(
    entityLike: DeepPartial<ProductEntity>,
  ): Promise<ProductEntity | undefined> {
    return this.repo.preload(entityLike);
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BusinessEntity } from '../../../businesses/infra/persistence/business.entity';
import { ProductVariantEntity } from './productVariant.entity';
import { CategoryEntity } from '../../../categories/infra/persistence/category.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'business_id' })
  businessId!: string;

  @ManyToOne(() => BusinessEntity, (business) => business.products)
  @JoinColumn({ name: 'business_id' })
  business!: Relation<BusinessEntity>;

  @Column({ name: 'category_id', nullable: true })
  categoryId?: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category?: Relation<CategoryEntity>;

  @OneToMany(() => ProductVariantEntity, (variant) => variant.product, {
    cascade: true,
  })
  variants!: Relation<ProductVariantEntity>[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

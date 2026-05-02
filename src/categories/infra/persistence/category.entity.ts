import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BusinessEntity } from '../../../businesses/infra/persistence/business.entity';
import { ProductEntity } from '../../../products/infra/persistence/product.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'business_id' })
  businessId!: string;

  @ManyToOne(() => BusinessEntity)
  @JoinColumn({ name: 'business_id' })
  business!: Relation<BusinessEntity>;

  @OneToMany(() => ProductEntity, 'category')
  products!: Relation<ProductEntity>[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;
}

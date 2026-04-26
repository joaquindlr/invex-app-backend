import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', name: 'full_name', nullable: true })
  fullName: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BusinessMemberEntity, (membership) => membership.user)
  memberships: Relation<BusinessMemberEntity>[];

  @Column({ default: 0 })
  maxAllowedBusinesses: number;
}

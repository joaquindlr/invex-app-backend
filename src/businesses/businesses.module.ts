import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessRepository } from './infra/persistence/business.repository';
import { BusinessEntity } from './infra/persistence/business.entity';
import { BusinessMemberEntity } from './infra/persistence/businessMember.entity';
import { BusinessesController } from './infra/web/businesses.controller';
import { Module } from '@nestjs/common';
import { CreateBusinessUseCase } from './application/createBusiness.uc';
import { UserEntity } from 'src/users/infra/persistence/user.entity';
import { GetUserBusinessesUseCase } from './application/getUserBusiness.uc';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusinessEntity,
      BusinessMemberEntity,
      UserEntity,
    ]),
  ],
  controllers: [BusinessesController],
  providers: [
    BusinessRepository,
    CreateBusinessUseCase,
    GetUserBusinessesUseCase,
  ],
  exports: [BusinessRepository, TypeOrmModule],
})
export class BusinessesModule {}

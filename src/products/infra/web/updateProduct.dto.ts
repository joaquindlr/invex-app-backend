import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto, CreateVariantDto } from './createProduct.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class UpdateVariantDto extends CreateVariantDto {}

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  attributes?: Record<string, any>;
}

export class UpdateVariantDto extends PartialType(
  OmitType(CreateVariantDto, ['stock'] as const),
) {}

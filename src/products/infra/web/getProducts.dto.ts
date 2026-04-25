import { IsNotEmpty, IsOptional, IsUUID, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsDto {
  @IsUUID()
  @IsNotEmpty()
  businessId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

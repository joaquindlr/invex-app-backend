/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsUUID, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMovementsDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

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

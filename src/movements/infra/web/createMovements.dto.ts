/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { MovementType } from 'src/movements/domain/movementType.enum';

export class CreateMovementDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsEnum(MovementType)
  @IsNotEmpty()
  type: MovementType;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

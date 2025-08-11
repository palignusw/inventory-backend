import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @IsInt()
  version?: number;
}

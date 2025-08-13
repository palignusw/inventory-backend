import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldDto } from './create-field.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateFieldDto extends PartialType(CreateFieldDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  version?: number;
}

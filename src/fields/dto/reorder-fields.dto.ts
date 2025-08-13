import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class ReorderFieldsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}

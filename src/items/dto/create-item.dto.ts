import { IsOptional, IsString, Length } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @Length(1, 64)
  customId: string;

  @IsOptional()
  fieldValues?: Record<string, string | number | boolean | null>;
}

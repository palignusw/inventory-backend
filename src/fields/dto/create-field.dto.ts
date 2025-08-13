import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { FieldType } from 'src/enums/fieldType';

export class CreateFieldDto {
  @IsString()
  @Length(1, 191)
  title: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsEnum(FieldType)
  type: FieldType;

  @IsOptional()
  @IsBoolean()
  showInTable?: boolean;
}

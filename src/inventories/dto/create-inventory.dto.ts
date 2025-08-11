import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsString()
  category: string;
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
  @IsOptional()
  @IsString()
  coverImageUrl?: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

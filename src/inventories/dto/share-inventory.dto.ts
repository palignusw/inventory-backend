import { Type } from 'class-transformer';
import { IsBoolean, IsInt, Min } from 'class-validator';

export class ShareDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @Type(() => Boolean)
  @IsBoolean()
  canWrite: boolean;
}

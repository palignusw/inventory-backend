import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AuthProvider } from 'src/enums/provider';

export class CreateUserDto {
  name: string;

  email: string;
  @IsOptional()
  @IsEnum(AuthProvider)
  provider?: AuthProvider;

  @IsOptional()
  @IsString()
  providerId?: string;
}

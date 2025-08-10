import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { AuthProvider } from 'src/enums/provider';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsEnum(AuthProvider)
  provider?: AuthProvider;

  @IsOptional()
  @IsString()
  providerId?: string;
}

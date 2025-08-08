import { PartialType } from '@nestjs/mapped-types';
import { CreateIdPartDto } from './create-id-part.dto';

export class UpdateIdPartDto extends PartialType(CreateIdPartDto) {}

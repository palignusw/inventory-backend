import { Module } from '@nestjs/common';
import { IdPartsService } from './id-parts.service';
import { IdPartsController } from './id-parts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdPart } from './entities/id-part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdPart])],
  controllers: [IdPartsController],
  providers: [IdPartsService],
})
export class IdPartsModule {}

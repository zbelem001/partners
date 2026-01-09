import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProspectsService } from './prospects.service';
import { ProspectsController } from './prospects.controller';
import { Prospect } from './entities/prospect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prospect])],
  controllers: [ProspectsController],
  providers: [ProspectsService],
})
export class ProspectsModule {}

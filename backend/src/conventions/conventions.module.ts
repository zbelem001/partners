import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConventionsService } from './conventions.service';
import { ConventionsController } from './conventions.controller';
import { WorkflowService } from './workflow.service';
import { Convention } from './entities/convention.entity';
import { ValidationHistory } from './entities/validation-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Convention, ValidationHistory])],
  controllers: [ConventionsController],
  providers: [ConventionsService, WorkflowService],
})
export class ConventionsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowStepsService } from './workflow-steps.service';
import { WorkflowStepsController } from './workflow-steps.controller';
import { WorkflowStep } from './entities/workflow-step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowStep])],
  controllers: [WorkflowStepsController],
  providers: [WorkflowStepsService],
})
export class WorkflowStepsModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowStep } from './entities/workflow-step.entity';
import { CreateWorkflowStepDto } from './dto/create-workflow-step.dto';
import { UpdateWorkflowStepDto } from './dto/update-workflow-step.dto';

@Injectable()
export class WorkflowStepsService {
  constructor(
    @InjectRepository(WorkflowStep)
    private workflowStepRepository: Repository<WorkflowStep>,
  ) {}

  create(createWorkflowStepDto: CreateWorkflowStepDto) {
    return this.workflowStepRepository.save(createWorkflowStepDto);
  }

  findAll() {
    return this.workflowStepRepository.find();
  }

  findOne(id: number) {
    return this.workflowStepRepository.findOneBy({ id });
  }

  update(id: number, updateWorkflowStepDto: UpdateWorkflowStepDto) {
    return this.workflowStepRepository.update(id, updateWorkflowStepDto);
  }

  remove(id: number) {
    return this.workflowStepRepository.delete(id);
  }
}

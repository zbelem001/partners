import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkflowStepsService } from './workflow-steps.service';
import { CreateWorkflowStepDto } from './dto/create-workflow-step.dto';
import { UpdateWorkflowStepDto } from './dto/update-workflow-step.dto';

@Controller('workflow-steps')
export class WorkflowStepsController {
  constructor(private readonly workflowStepsService: WorkflowStepsService) {}

  @Post()
  create(@Body() createWorkflowStepDto: CreateWorkflowStepDto) {
    return this.workflowStepsService.create(createWorkflowStepDto);
  }

  @Get()
  findAll() {
    return this.workflowStepsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowStepsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkflowStepDto: UpdateWorkflowStepDto) {
    return this.workflowStepsService.update(+id, updateWorkflowStepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowStepsService.remove(+id);
  }
}

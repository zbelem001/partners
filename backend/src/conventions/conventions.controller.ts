import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ConventionsService } from './conventions.service';
import { WorkflowService, ValidationAction } from './workflow.service';
import { CreateConventionDto } from './dto/create-convention.dto';
import { UpdateConventionDto } from './dto/update-convention.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('conventions')
export class ConventionsController {
  constructor(
    private readonly conventionsService: ConventionsService,
    private readonly workflowService: WorkflowService
  ) {}

  @Post()
  create(@Body() createConventionDto: CreateConventionDto) {
    return this.conventionsService.create(createConventionDto);
  }

  @Get()
  findAll() {
    return this.conventionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyConventions(@Request() req) {
    return this.conventionsService.findByResponsibleUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conventionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConventionDto: UpdateConventionDto) {
    return this.conventionsService.update(id, updateConventionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conventionsService.remove(id);
  }

  // WORKFLOW ENDPOINTS

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit-validation')
  submitForValidation(@Param('id') id: string, @Request() req) {
    return this.workflowService.submitForValidation(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/validate')
  validateConvention(
    @Param('id') id: string,
    @Body() body: { action: string; comment?: string },
    @Request() req
  ) {
    const validatorRole = req.user.role; // SRECIP, DFC, CAQ, DG
    const validatorId = req.user.userId;
    const validatorName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim();

    return this.workflowService.validate(
      id,
      validatorRole,
      validatorId,
      validatorName,
      body.action as ValidationAction,
      body.comment
    );
  }

  @Get(':id/validation-history')
  getValidationHistory(@Param('id') id: string) {
    return this.workflowService.getValidationHistory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pending/:role')
  getPendingValidations(@Param('role') role: string) {
    return this.workflowService.getPendingValidations(role as any);
  }
}

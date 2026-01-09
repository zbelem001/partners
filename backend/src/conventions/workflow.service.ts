import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Convention } from './entities/convention.entity';
import { ValidationHistory } from './entities/validation-history.entity';

export enum ValidationStatus {
  DRAFT = 'DRAFT',
  PENDING_SRECIP = 'PENDING_SRECIP',
  PENDING_DFC = 'PENDING_DFC',
  PENDING_CAQ = 'PENDING_CAQ',
  PENDING_DG = 'PENDING_DG',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ValidatorRole {
  SRECIP = 'SRECIP',
  DFC = 'DFC',
  CAQ = 'CAQ',
  DG = 'DG'
}

export enum ValidationAction {
  APPROVE = 'APPROVED',
  REJECT = 'REJECTED',
  REQUEST_CHANGES = 'REQUESTED_CHANGES'
}

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Convention)
    private conventionsRepository: Repository<Convention>,
    @InjectRepository(ValidationHistory)
    private validationHistoryRepository: Repository<ValidationHistory>,
  ) {}

  // Workflow transitions: DRAFT -> SRECIP -> DFC -> CAQ -> DG -> APPROVED
  private readonly workflowSteps = [
    { status: ValidationStatus.DRAFT, nextRole: ValidatorRole.SRECIP },
    { status: ValidationStatus.PENDING_SRECIP, nextRole: ValidatorRole.DFC },
    { status: ValidationStatus.PENDING_DFC, nextRole: ValidatorRole.CAQ },
    { status: ValidationStatus.PENDING_CAQ, nextRole: ValidatorRole.DG },
    { status: ValidationStatus.PENDING_DG, nextRole: null }, // Final step
  ];

  async submitForValidation(conventionId: string, userId: string): Promise<Convention> {
    const convention = await this.conventionsRepository.findOneBy({ id: conventionId });
    
    if (!convention) {
      throw new BadRequestException('Convention not found');
    }

    if (convention.validationStatus !== ValidationStatus.DRAFT) {
      throw new BadRequestException('Convention already submitted for validation');
    }

    // Start validation workflow
    convention.validationStatus = ValidationStatus.PENDING_SRECIP;
    convention.currentValidatorRole = ValidatorRole.SRECIP;

    await this.conventionsRepository.save(convention);

    // Log submission
    await this.logValidation(
      conventionId,
      'SUBMITTER',
      userId,
      'Soumis par responsable',
      'SUBMIT',
      '',
      ValidationStatus.DRAFT,
      ValidationStatus.PENDING_SRECIP
    );

    return convention;
  }

  async validate(
    conventionId: string,
    validatorRole: ValidatorRole,
    validatorId: string,
    validatorName: string,
    action: ValidationAction,
    comment?: string
  ): Promise<Convention> {
    const convention = await this.conventionsRepository.findOneBy({ id: conventionId });
    
    if (!convention) {
      throw new BadRequestException('Convention not found');
    }

    // Check if validator has permission for current step
    if (convention.currentValidatorRole !== validatorRole) {
      throw new ForbiddenException(
        `This convention is currently at ${convention.currentValidatorRole} step, not ${validatorRole}`
      );
    }

    const fromStatus = convention.validationStatus;
    let toStatus: ValidationStatus;

    if (action === ValidationAction.REJECT) {
      toStatus = ValidationStatus.REJECTED;
      convention.validationStatus = toStatus;
      convention.currentValidatorRole = null;
    } else if (action === ValidationAction.APPROVE) {
      // Move to next step
      const nextStep = this.getNextStep(convention.validationStatus);
      
      if (nextStep) {
        toStatus = nextStep.status;
        convention.validationStatus = toStatus;
        convention.currentValidatorRole = nextStep.nextRole;
      } else {
        // Final approval
        toStatus = ValidationStatus.APPROVED;
        convention.validationStatus = toStatus;
        convention.currentValidatorRole = null;
        convention.status = 'Signed'; // Update convention status
      }

      // Record validator
      if (!convention.validatedBy) {
        convention.validatedBy = {};
      }
      const roleKey = validatorRole.toLowerCase() as 'srecip' | 'dfc' | 'caq' | 'dg';
      convention.validatedBy[roleKey] = {
        userId: validatorId,
        name: validatorName,
        date: new Date().toISOString()
      };
    } else {
      // REQUEST_CHANGES - send back to draft
      toStatus = ValidationStatus.DRAFT;
      convention.validationStatus = toStatus;
      convention.currentValidatorRole = null;
    }

    await this.conventionsRepository.save(convention);

    // Log validation action
    await this.logValidation(
      conventionId,
      validatorRole,
      validatorId,
      validatorName,
      action,
      comment || '',
      fromStatus,
      toStatus
    );

    return convention;
  }

  private getNextStep(currentStatus: ValidationStatus): { status: ValidationStatus, nextRole: ValidatorRole } | null {
    const stepMap = {
      [ValidationStatus.PENDING_SRECIP]: {
        status: ValidationStatus.PENDING_DFC,
        nextRole: ValidatorRole.DFC
      },
      [ValidationStatus.PENDING_DFC]: {
        status: ValidationStatus.PENDING_CAQ,
        nextRole: ValidatorRole.CAQ
      },
      [ValidationStatus.PENDING_CAQ]: {
        status: ValidationStatus.PENDING_DG,
        nextRole: ValidatorRole.DG
      },
      [ValidationStatus.PENDING_DG]: null // Final step
    };

    return stepMap[currentStatus] || null;
  }

  private async logValidation(
    conventionId: string,
    validatorRole: string,
    validatorId: string,
    validatorName: string,
    action: string,
    comment: string,
    fromStatus: string,
    toStatus: string
  ): Promise<void> {
    const log = this.validationHistoryRepository.create({
      conventionId,
      validatorRole,
      validatorId,
      validatorName,
      action,
      comment,
      fromStatus,
      toStatus
    });

    await this.validationHistoryRepository.save(log);
  }

  async getValidationHistory(conventionId: string): Promise<ValidationHistory[]> {
    return this.validationHistoryRepository.find({
      where: { conventionId },
      order: { createdAt: 'ASC' }
    });
  }

  async getPendingValidations(validatorRole: ValidatorRole): Promise<Convention[]> {
    const statusMap = {
      [ValidatorRole.SRECIP]: ValidationStatus.PENDING_SRECIP,
      [ValidatorRole.DFC]: ValidationStatus.PENDING_DFC,
      [ValidatorRole.CAQ]: ValidationStatus.PENDING_CAQ,
      [ValidatorRole.DG]: ValidationStatus.PENDING_DG
    };

    return this.conventionsRepository.find({
      where: { validationStatus: statusMap[validatorRole] }
    });
  }
}

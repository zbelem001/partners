import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from './entities/milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
  ) {}

  create(createMilestoneDto: CreateMilestoneDto) {
    return this.milestoneRepository.save(createMilestoneDto);
  }

  findAll() {
    return this.milestoneRepository.find();
  }

  findOne(id: number) {
    return this.milestoneRepository.findOneBy({ id });
  }

  update(id: number, updateMilestoneDto: UpdateMilestoneDto) {
    return this.milestoneRepository.update(id, updateMilestoneDto);
  }

  remove(id: number) {
    return this.milestoneRepository.delete(id);
  }
}

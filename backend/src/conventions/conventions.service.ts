import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Convention } from './entities/convention.entity';
import { CreateConventionDto } from './dto/create-convention.dto';
import { UpdateConventionDto } from './dto/update-convention.dto';

@Injectable()
export class ConventionsService {
  constructor(
    @InjectRepository(Convention)
    private conventionsRepository: Repository<Convention>,
  ) {}

  create(createConventionDto: CreateConventionDto) {
    return this.conventionsRepository.save(createConventionDto);
  }

  findAll() {
    return this.conventionsRepository.find();
  }

  findByResponsibleUser(userId: number) {
    return this.conventionsRepository.find({
      where: { responsibleUserId: userId }
    });
  }

  findOne(id: string) {
    return this.conventionsRepository.findOneBy({ id });
  }

  update(id: string, updateConventionDto: UpdateConventionDto) {
    return this.conventionsRepository.update(id, updateConventionDto);
  }

  remove(id: string) {
    return this.conventionsRepository.delete(id);
  }
}

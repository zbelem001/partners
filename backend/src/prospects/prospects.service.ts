import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prospect } from './entities/prospect.entity';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';

@Injectable()
export class ProspectsService {
  constructor(
    @InjectRepository(Prospect)
    private prospectRepository: Repository<Prospect>,
  ) {}

  async create(createProspectDto: CreateProspectDto) {
    // Generate a reference for the prospect (e.g., PR-2026-1234)
    const year = new Date().getFullYear();
    const count = await this.prospectRepository.count();
    const reference = `PR-${year}-${(count + 1).toString().padStart(3, '0')}`;

    const newProspect = this.prospectRepository.create({
      ...createProspectDto,
      reference,
      submissionDate: new Date(),
    });

    return this.prospectRepository.save(newProspect);
  }

  findAll() {
    return this.prospectRepository.find();
  }

  findOne(id: string) {
    return this.prospectRepository.findOneBy({ id });
  }

  update(id: string, updateProspectDto: UpdateProspectDto) {
    return this.prospectRepository.update(id, updateProspectDto);
  }

  remove(id: string) {
    return this.prospectRepository.delete(id);
  }
}

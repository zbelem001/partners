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

  create(createProspectDto: CreateProspectDto) {
    return this.prospectRepository.save(createProspectDto);
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

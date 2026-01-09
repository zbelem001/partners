import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private partnersRepository: Repository<Partner>,
  ) {}

  create(createPartnerDto: CreatePartnerDto) {
    return this.partnersRepository.save(createPartnerDto);
  }

  findAll() {
    return this.partnersRepository.find();
  }

  findOne(id: string) {
    return this.partnersRepository.findOneBy({ id });
  }

  update(id: string, updatePartnerDto: UpdatePartnerDto) {
    return this.partnersRepository.update(id, updatePartnerDto);
  }

  remove(id: string) {
    return this.partnersRepository.delete(id);
  }
}

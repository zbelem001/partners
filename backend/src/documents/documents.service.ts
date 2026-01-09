import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  create(createDocumentDto: CreateDocumentDto) {
    return this.documentRepository.save(createDocumentDto);
  }

  findAll() {
    return this.documentRepository.find();
  }

  findOne(id: string) {
    return this.documentRepository.findOneBy({ id });
  }

  update(id: string, updateDocumentDto: UpdateDocumentDto) {
    return this.documentRepository.update(id, updateDocumentDto);
  }

  remove(id: string) {
    return this.documentRepository.delete(id);
  }
}

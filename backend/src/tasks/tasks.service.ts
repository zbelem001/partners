import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.save(createTaskDto);
  }

  findAll() {
    return this.tasksRepository.find();
  }

  findByAssignedUser(userId: string) {
    return this.tasksRepository.find({
      where: { assignedTo: userId }
    });
  }

  findOne(id: string) {
    return this.tasksRepository.findOneBy({ id });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.tasksRepository.update(id, updateTaskDto);
  }

  remove(id: string) {
    return this.tasksRepository.delete(id);
  }
}

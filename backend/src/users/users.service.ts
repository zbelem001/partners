import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      createUserDto.passwordHash = await bcrypt.hash(createUserDto.password, salt);
    }
    
    // Create a new object for saving to avoid mutating or passing 'password' field
    const userData = { ...createUserDto };
    delete (userData as any).password; // Remove raw password

    // Handle empty string for unique nullable fields (Postgres/SQLite treats '' as a value)
    if (userData.employeeId === '') {
      userData.employeeId = null;
    }

    try {
      return await this.usersRepository.save(userData);
    } catch (error) {
       // Check for unique constraint violation (error code 23505 in Postgres, 19 in SQLite)
       // The error object structure varies by driver. Checking message is generic fall-back.
       if (error.code === '23505' || error.errno === 19 || error.message?.includes('UNIQUE')) {
          throw new ConflictException('Cet email ou cet ID employé est déjà utilisé.'); 
       }
       throw error;
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByEmailOrEmployeeId(identifier: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [
        { email: identifier },
        { employeeId: identifier }
      ]
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}

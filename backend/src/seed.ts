import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from './users/entities/user.entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const dataSource = app.get(DataSource);

  // Admin Details
  const adminEmail = 'B20241313'; // Using ID as email field based on request
  const rawPassword = '13135690M@';
  
  console.log(`Checking if admin ${adminEmail} exists...`);

  const userRepository = dataSource.getRepository(User);
  const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });

  if (existingAdmin) {
    console.log('Admin user already exists.');
  } else {
    console.log('Creating Admin user...');
    
    // Hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const newAdmin = new User();
    newAdmin.email = adminEmail;
    newAdmin.firstName = 'Admin';
    newAdmin.lastName = 'System';
    newAdmin.role = 'Admin';
    newAdmin.department = 'IT';
    newAdmin.status = 'Active';
    newAdmin.passwordHash = passwordHash;

    await userRepository.save(newAdmin);
    console.log(`Admin user created successfully with ID: ${newAdmin.id}`);
  }

  await app.close();
}

bootstrap();

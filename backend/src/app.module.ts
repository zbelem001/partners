import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PartnersModule } from './partners/partners.module';
import { UsersModule } from './users/users.module';
import { ConventionsModule } from './conventions/conventions.module';
import { ProspectsModule } from './prospects/prospects.module';
import { ProjectsModule } from './projects/projects.module';
import { DocumentsModule } from './documents/documents.module';
import { MilestonesModule } from './milestones/milestones.module';
import { WorkflowStepsModule } from './workflow-steps/workflow-steps.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'partners.db', // Local file database
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // ⚠️ DEV ONLY: Auto-create tables on save
    }),
    PartnersModule,
    UsersModule,
    ConventionsModule,
    ProspectsModule,
    ProjectsModule,
    DocumentsModule,
    MilestonesModule,
    WorkflowStepsModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

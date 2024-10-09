import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';
import { Process } from './process.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Process]),
  ],
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class ProcessModule {}

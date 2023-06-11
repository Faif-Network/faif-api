import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CalendarEntity,
  CalendarSchema,
} from 'src/infrastructure/entities/calendar.entity';
import { CalendarRepository } from 'src/infrastructure/repositories/calendar.repository';
import { CalendarController } from '../controllers/calendar.controller';
import { CalendarService } from '../services/calendar.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CalendarEntity.name, schema: CalendarSchema },
    ]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarRepository],
})
export class CalendarModule {}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CalendarEntity } from '../entities/calendar.entity';

@Injectable()
export class CalendarRepository {
  constructor(
    @InjectModel(CalendarEntity.name)
    private readonly calendarModel: Model<CalendarEntity>
  ) {}

  async findCalendarByUserId(user_id: string): Promise<CalendarEntity[]> {
    return this.calendarModel
      .find({ user_id })
      .sort({
        start_at: -1,
      })
      .exec();
  }

  async createCalendar(
    calendar: Partial<CalendarEntity>
  ): Promise<CalendarEntity> {
    const id = new Types.ObjectId();
    const created_calendar = new this.calendarModel({
      _id: id,
      id: id.toString(),
      ...calendar,
    });

    await created_calendar.save();
    return created_calendar;
  }
}

import { Injectable } from '@nestjs/common';
import { CalendarRepository } from 'src/infrastructure/repositories/calendar.repository';

export type AgendaEntry = {
  name: string;
  height: number;
  day: string;
};
export type AgendaSchedule = {
  [date: string]: AgendaEntry[];
};

@Injectable()
export class CalendarService {
  constructor(private readonly calendarRepository: CalendarRepository) {}

  async findCalendarByUserId(user_id: string) {
    const items = await this.calendarRepository.findCalendarByUserId(user_id);
    console.log(items);
    if (items.length === 0) {
      return {} as AgendaSchedule;
    } else {
      const formattedData: AgendaSchedule = {};

      items.forEach((item) => {
        const dateKey = new Date(item.start_at).toISOString().split('T')[0];

        if (!formattedData[dateKey]) {
          formattedData[dateKey] = [];
        }

        const agendaEntry: AgendaEntry = {
          name: item.description,
          height: 50,
          day: dateKey,
        };

        formattedData[dateKey].push(agendaEntry);
      });

      return formattedData;
    }
  }

  async createCalendar(data: CreateCalendarDTO) {
    return await this.calendarRepository.createCalendar(data);
  }
}

export interface CreateCalendarDTO {
  user_id: string;
  description: string;
  start_at: number;
  event_type: string;
}

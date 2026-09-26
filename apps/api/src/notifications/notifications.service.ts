import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

const REMINDER_HOURS_BEFORE = 24;

@Injectable()
export class NotificationsService {
  constructor(@InjectQueue('notifications') private readonly queue: Queue) {}

  // BookingsService, transaction COMMIT sonrasi bu metotlari cagirir -
  // asla transaction icinden degil (Bolum 12.1'deki karar).

  async enqueueBookingConfirmed(bookingId: string) {
    await this.queue.add(
      'booking-confirmed',
      { bookingId },
      { jobId: `confirm:${bookingId}` },
    );
  }

  async enqueueBookingReminder(bookingId: string, startTime: Date) {
    const delay =
      startTime.getTime() - REMINDER_HOURS_BEFORE * 3600_000 - Date.now();
    if (delay <= 0) return; // randevu zaten 24 saatten yakinsa hatirlatma atlanir

    await this.queue.add(
      'booking-reminder',
      { bookingId },
      { jobId: `reminder:${bookingId}`, delay },
    );
  }

  async enqueueBookingCancelled(bookingId: string) {
    // Iptal edildiginde bekleyen hatirlatma isi varsa iptal edilir -
    // gecersiz bir randevu icin hatirlatma gitmesin.
    const reminderJob = await this.queue.getJob(`reminder:${bookingId}`);
    if (reminderJob) await reminderJob.remove();

    await this.queue.add(
      'booking-cancelled',
      { bookingId },
      { jobId: `cancel:${bookingId}` },
    );
  }
}

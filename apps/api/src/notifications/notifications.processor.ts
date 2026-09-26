import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service.js';
import { SmsService } from '../sms/sms.service.js';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sms: SmsService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { bookingId } = job.data;

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, service: true },
    });
    if (!booking) {
      this.logger.warn(`Booking ${bookingId} bulunamadı, iş atlanıyor.`);
      return;
    }

    const time = new Date(booking.startTime).toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });

    switch (job.name) {
      case 'booking-confirmed':
        await this.sms.send(
          booking.customer.phone,
          `Randevunuz alındı: ${booking.service.name}, ${time}.`,
        );
        break;
      case 'booking-reminder':
        await this.sms.send(
          booking.customer.phone,
          `Hatırlatma: yarın ${time} saatinde ${booking.service.name} randevunuz var.`,
        );
        break;
      case 'booking-cancelled':
        await this.sms.send(
          booking.customer.phone,
          `Randevunuz iptal edildi: ${booking.service.name}, ${time}.`,
        );
        break;
    }
  }
}

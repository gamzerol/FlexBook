import { UnprocessableEntityException } from '@nestjs/common';
import type { BookingStatus } from '@prisma/client';

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CANCELLED', 'COMPLETED', 'NO_SHOW'],
  CANCELLED: [], // terminal
  COMPLETED: [], // terminal
  NO_SHOW: [], // terminal
};

export function assertValidTransition(
  currentStatus: BookingStatus,
  nextStatus: BookingStatus,
  startTime: Date,
) {
  if (!ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus)) {
    throw new UnprocessableEntityException(
      `${currentStatus} durumundan ${nextStatus} durumuna geçilemez.`,
    );
  }

  if (nextStatus === 'NO_SHOW' && new Date() < startTime) {
    throw new UnprocessableEntityException(
      'Randevu başlamadan NO_SHOW olarak işaretlenemez.',
    );
  }
}

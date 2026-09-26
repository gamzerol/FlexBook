import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { assertValidTransition } from './booking-transitions.js';
import type { CreateBookingInput } from '@flexbook/shared';
import type { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    businessId: string,
    filters: {
      resourceId?: string;
      status?: BookingStatus;
      from?: Date;
      to?: Date;
    },
  ) {
    return this.prisma.booking.findMany({
      where: {
        businessId,
        ...(filters.resourceId ? { resourceId: filters.resourceId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.from && filters.to
          ? { startTime: { gte: filters.from, lt: filters.to } }
          : {}),
      },
      include: { resource: true, service: true, customer: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async create(businessId: string, input: CreateBookingInput) {
    const [resource, service] = await Promise.all([
      this.prisma.resource.findFirst({
        where: { id: input.resourceId, businessId },
      }),
      this.prisma.service.findFirst({
        where: { id: input.serviceId, businessId },
      }),
    ]);
    if (!resource) throw new NotFoundException('Kaynak bulunamadı.');
    if (!service) throw new NotFoundException('Hizmet bulunamadı.');

    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { businessId_phone: { businessId, phone: input.customerPhone } },
        update: { name: input.customerName },
        create: {
          businessId,
          name: input.customerName,
          phone: input.customerPhone,
        },
      });

      const overlapping = await tx.booking.findFirst({
        where: {
          resourceId: input.resourceId,
          status: { not: 'CANCELLED' },
          startTime: { lt: input.endTime },
          endTime: { gt: input.startTime },
        },
      });
      if (overlapping) {
        throw new ConflictException('Bu zaman aralığı artık müsait değil.');
      }

      // 3. Kaydi olustur.
      return tx.booking.create({
        data: {
          businessId,
          resourceId: input.resourceId,
          serviceId: input.serviceId,
          customerId: customer.id,
          startTime: input.startTime,
          endTime: input.endTime,
          status: 'PENDING',
        },
        include: { resource: true, service: true, customer: true },
      });
    });
  }

  async updateStatus(
    businessId: string,
    id: string,
    nextStatus: BookingStatus,
  ) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, businessId },
    });
    if (!booking) throw new NotFoundException('Rezervasyon bulunamadı.');

    assertValidTransition(booking.status, nextStatus, booking.startTime);

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: nextStatus,
        cancelledAt: nextStatus === 'CANCELLED' ? new Date() : undefined,
      },
      include: { resource: true, service: true, customer: true },
    });
  }
}

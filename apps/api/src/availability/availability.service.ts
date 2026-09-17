import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { SetAvailabilityInput } from '@flexbook/shared';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}
  private async assertOwnership(businessId: string, resourceId: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id: resourceId, businessId },
    });
    if (!resource) throw new NotFoundException('Kaynak bulunamadı.');
  }

  async findAll(businessId: string, resourceId: string) {
    await this.assertOwnership(businessId, resourceId);
    return this.prisma.availabilityRule.findMany({
      where: { resourceId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }
  async set(
    businessId: string,
    resourceId: string,
    rules: SetAvailabilityInput,
  ) {
    await this.assertOwnership(businessId, resourceId);

    return this.prisma.$transaction(async (tx) => {
      await tx.availabilityRule.deleteMany({ where: { resourceId } });
      if (rules.length === 0) return [];

      await tx.availabilityRule.createMany({
        data: rules.map((rule) => ({ ...rule, resourceId })),
      });

      return tx.availabilityRule.findMany({
        where: { resourceId },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      });
    });
  }
}

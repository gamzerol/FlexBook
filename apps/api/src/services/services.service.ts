import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateServiceInput, UpdateServiceInput } from '@flexbook/shared';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(businessId: string) {
    return this.prisma.service.findMany({
      where: { businessId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(businessId: string, input: CreateServiceInput) {
    return this.prisma.service.create({ data: { ...input, businessId } });
  }

  async update(businessId: string, id: string, input: UpdateServiceInput) {
    const service = await this.prisma.service.findFirst({
      where: { id, businessId },
    });
    if (!service) throw new NotFoundException('Hizmet bulunamadı.');

    return this.prisma.service.update({ where: { id }, data: input });
  }

  async remove(businessId: string, id: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, businessId },
    });
    if (!service) throw new NotFoundException('Hizmet bulunamadı.');

    return this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async setResources(
    businessId: string,
    serviceId: string,
    resourceIds: string[],
  ) {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, businessId },
    });
    if (!service) throw new NotFoundException('Hizmet bulunamadı.');

    await this.prisma.resourceService.deleteMany({ where: { serviceId } });
    await this.prisma.resourceService.createMany({
      data: resourceIds.map((resourceId) => ({ serviceId, resourceId })),
    });

    return this.prisma.resourceService.findMany({
      where: { serviceId },
      include: { resource: true },
    });
  }
}

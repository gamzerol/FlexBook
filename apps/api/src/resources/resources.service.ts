import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  CreateResourceInput,
  UpdateResourceInput,
} from '@flexbook/shared';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(businessId: string) {
    return this.prisma.resource.findMany({
      where: { businessId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(businessId: string, input: CreateResourceInput) {
    return this.prisma.resource.create({
      data: { ...input, businessId },
    });
  }

  async update(businessId: string, id: string, input: UpdateResourceInput) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, businessId },
    });
    if (!resource) throw new NotFoundException('Kaynak bulunamadı.');

    return this.prisma.resource.update({ where: { id }, data: input });
  }

  async remove(businessId: string, id: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, businessId },
    });
    if (!resource) throw new NotFoundException('Kaynak bulunamadı.');

    return this.prisma.resource.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

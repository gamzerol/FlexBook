import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}
  async findMe(businessId: string) {
    const business = await this.prisma.business.findFirstOrThrow({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        slug: true,
        sector: true,
        email: true,
        timezone: true,
      },
    });
    return business;
  }
}

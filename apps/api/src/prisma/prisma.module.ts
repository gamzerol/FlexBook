import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global() // Global yaptık ki her modülde ayrıca import etmemize gerek kalmasın
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ResourcesModule } from './resources/resources.module.js';
import { ServicesModule } from './services/services.module.js';
import { BusinessModule } from './business/business.module.js';
import { AvailabilityModule } from './availability/availability.module.js';
import { BookingsModule } from './bookings/bookings.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ResourcesModule,
    ServicesModule,
    BusinessModule,
    AvailabilityModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

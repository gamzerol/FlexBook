import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentBusiness } from '../common/decorators/current-business.decorator.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from '@flexbook/shared';
import type {
  CreateBookingInput,
  UpdateBookingStatusInput,
} from '@flexbook/shared';
import { BookingsService } from './bookings.service.js';
import type { BookingStatus } from '@prisma/client';

@Controller('api/v1/bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  findAll(
    @CurrentBusiness() businessId: string,
    @Query('resourceId') resourceId?: string,
    @Query('status') status?: BookingStatus,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.bookingsService.findAll(businessId, {
      resourceId,
      status,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Post()
  create(
    @CurrentBusiness() businessId: string,
    @Body(new ZodValidationPipe(createBookingSchema)) dto: CreateBookingInput,
  ) {
    return this.bookingsService.create(businessId, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateBookingStatusSchema))
    dto: UpdateBookingStatusInput,
  ) {
    return this.bookingsService.updateStatus(businessId, id, dto.status);
  }
}

import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentBusiness } from '../common/decorators/current-business.decorator.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { setAvailabilitySchema } from '@flexbook/shared';
import type { SetAvailabilityInput } from '@flexbook/shared';
import { AvailabilityService } from './availability.service.js';

@Controller('api/v1/resources/:resourceId/availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  findAll(
    @CurrentBusiness() businessId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.availabilityService.findAll(businessId, resourceId);
  }

  @Put()
  set(
    @CurrentBusiness() businessId: string,
    @Param('resourceId') resourceId: string,
    @Body(new ZodValidationPipe(setAvailabilitySchema))
    rules: SetAvailabilityInput,
  ) {
    return this.availabilityService.set(businessId, resourceId, rules);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentBusiness } from '../common/decorators/current-business.decorator.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { createServiceSchema, updateServiceSchema } from '@flexbook/shared';
import type { CreateServiceInput, UpdateServiceInput } from '@flexbook/shared';
import { ServicesService } from './services.service.js';

const setResourcesSchema = z.object({
  resourceIds: z.array(z.string().uuid()),
});

@Controller('api/v1/services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll(@CurrentBusiness() businessId: string) {
    return this.servicesService.findAll(businessId);
  }

  @Post()
  create(
    @CurrentBusiness() businessId: string,
    @Body(new ZodValidationPipe(createServiceSchema)) dto: CreateServiceInput,
  ) {
    return this.servicesService.create(businessId, dto);
  }

  @Patch(':id')
  update(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateServiceSchema)) dto: UpdateServiceInput,
  ) {
    return this.servicesService.update(businessId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentBusiness() businessId: string, @Param('id') id: string) {
    return this.servicesService.remove(businessId, id);
  }

  @Put(':id/resources')
  setResources(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(setResourcesSchema))
    dto: { resourceIds: string[] },
  ) {
    return this.servicesService.setResources(businessId, id, dto.resourceIds);
  }
}

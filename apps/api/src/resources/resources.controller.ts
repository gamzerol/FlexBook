import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentBusiness } from '../common/decorators/current-business.decorator.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { createResourceSchema, updateResourceSchema } from '@flexbook/shared';
import type {
  CreateResourceInput,
  UpdateResourceInput,
} from '@flexbook/shared';
import { ResourcesService } from './resources.service.js';

@Controller('api/v1/resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resorcesService: ResourcesService) {}

  @Get()
  findAll(@CurrentBusiness() businessId: string) {
    return this.resorcesService.findAll(businessId);
  }

  @Post()
  create(
    @CurrentBusiness() businessId: string,
    @Body(new ZodValidationPipe(createResourceSchema)) dto: CreateResourceInput,
  ) {
    return this.resorcesService.create(businessId, dto);
  }

  @Patch(':id')
  update(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateResourceSchema)) dto: UpdateResourceInput,
  ) {
    return this.resorcesService.update(businessId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentBusiness() businessId: string, @Param('id') id: string) {
    return this.resorcesService.remove(businessId, id);
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentBusiness } from '../common/decorators/current-business.decorator.js';
import { BusinessService } from './business.service.js';

@Controller('api/v1/business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('me')
  findMe(@CurrentBusiness() businessId: string) {
    return this.businessService.findMe(businessId);
  }
}

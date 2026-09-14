import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller.js';
import { BusinessService } from './business.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}

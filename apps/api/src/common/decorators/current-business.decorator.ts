import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentBusiness = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.businessId;
  },
);

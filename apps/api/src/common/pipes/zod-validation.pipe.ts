import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const firstError = result.error.issues[0];
      throw new BadRequestException(
        `${firstError.path.join('.')}: ${firstError.message}`,
      );
    }
    return result.data;
  }
}

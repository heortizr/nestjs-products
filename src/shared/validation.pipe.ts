import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new BadRequestException('no body submitted');
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(
        `Validation failed ${this.formatErrors(errors)}`,
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]) {
    return errors
      .map(err => {
        for (const property in err.constraints) {
          if (err.constraints.hasOwnProperty(property)) {
            return err.constraints[property];
          }
        }
      })
      .join(', ');
  }

  private isEmpty(value: any) {
    return Object.keys(value).length < 1;
  }
}

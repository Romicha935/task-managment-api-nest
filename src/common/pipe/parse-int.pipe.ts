import {
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: any) {
    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('Value must be a number');
    }

    return parsedValue;
  }
}
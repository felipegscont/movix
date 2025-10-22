import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class EmptyStringToUndefinedPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null) {
      return this.transformObject(value);
    }
    return value;
  }

  private transformObject(obj: any): any {
    const transformed = { ...obj };
    
    for (const key in transformed) {
      if (transformed[key] === '') {
        transformed[key] = undefined;
      } else if (typeof transformed[key] === 'object' && transformed[key] !== null) {
        transformed[key] = this.transformObject(transformed[key]);
      }
    }
    
    return transformed;
  }
}


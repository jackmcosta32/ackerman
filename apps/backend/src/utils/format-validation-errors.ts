import {
  HttpStatus,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';

export interface FlattenedError {
  [key: string]: string[];
}

const flattenValidationErrors = (
  errors: ValidationError[],
  parentKey = '',
  result: FlattenedError = {},
): FlattenedError => {
  for (const error of errors) {
    const key = parentKey ? `${parentKey}.${error.property}` : error.property;

    if (error.constraints) {
      result[key] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      flattenValidationErrors(error.children, key, result);
    }
  }

  return result;
};

export const formatValidationErrors = (errors: ValidationError[]) => {
  const flattened = flattenValidationErrors(errors);

  return new BadRequestException({
    error: 'Bad Request',
    message: flattened,
    statusCode: HttpStatus.BAD_REQUEST,
  });
};

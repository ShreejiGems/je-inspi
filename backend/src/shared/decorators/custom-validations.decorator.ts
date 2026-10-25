/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { DateTime } from 'luxon';
import { DATE_SETTINGS } from 'src/keys';

export function ValidateDateTime(
  property?: { format?: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateDateTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [property] = args.constraints;

          let isValid = true;
          if (value) {
            isValid = false;

            const format = property?.format
              ? property?.format
              : DATE_SETTINGS.DATE_TIME_FORMAT;

            const tmpVal = DateTime.fromFormat(value, format);
            isValid = tmpVal.isValid;
          }

          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return DATE_SETTINGS.INVALID_DATE_TIME;
        },
      },
    });
  };
}

export function ValidatePhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidatePhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let isValid = true;
          if (value) {
            if (value.length <= 10) {
              const pattern = /^\d{10}$/;
              isValid = pattern.test(value);
            }
          }

          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return DATE_SETTINGS.INVALID_DATE_TIME;
        },
      },
    });
  };
}

export function ValidateCountryCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidateCountryCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let isValid = true;
          if (value !== '') {
            const pattern = /^(\+?\d{1,3}|\d{1,4})$/;
            isValid = pattern.test(value);
          }

          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return DATE_SETTINGS.INVALID_DATE_TIME;
        },
      },
    });
  };
}

export function IsFutureDateTime(
  property?: { format?: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDateTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [property] = args.constraints;

          let isValid = true;
          if (value) {
            isValid = false;

            const format = property?.format
              ? property?.format
              : DATE_SETTINGS.DATE_TIME_FORMAT;

            const tmpVal = DateTime.fromFormat(value, format);
            const nowVal = DateTime.fromFormat(
              DateTime.utc().toFormat(format),
              format,
            );
            if (tmpVal.isValid) {
              isValid = tmpVal.toMillis() >= nowVal.toMillis();
            }
          }

          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return DATE_SETTINGS.INVALID_DATE_TIME;
        },
      },
    });
  };
}

export function IsGreaterThanDateTime(
  property?: { field: string; format?: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanDateTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [property] = args.constraints;

          let isValid = true;
          if (value) {
            isValid = false;

            const format = property?.format
              ? property?.format
              : DATE_SETTINGS.DATE_TIME_FORMAT;

            const relatedValue = (args.object as any)[property.field];
            if (relatedValue) {
              const tmpVal1 = DateTime.fromFormat(value, format);
              const tmpVal2 = DateTime.fromFormat(relatedValue, format);

              if (tmpVal1.isValid && tmpVal2.isValid) {
                isValid = tmpVal1.toMillis() >= tmpVal2.toMillis();
              }
            }
          }

          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return DATE_SETTINGS.INVALID_DATE_TIME;
        },
      },
    });
  };
}

export function IsPastDateTime(
  property?: { format?: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPastDateTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [property] = args.constraints;

          let isValid = true;
          if (value) {
            isValid = false;

            const format = property?.format
              ? property?.format
              : DATE_SETTINGS.DATE_TIME_FORMAT;

            const tmpVal = DateTime.fromFormat(value, format);
            const nowVal = DateTime.fromFormat(
              DateTime.utc().toFormat(format),
              format,
            );
            if (tmpVal.isValid) {
              isValid = tmpVal.toMillis() <= nowVal.toMillis();
            }
          }

          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return DATE_SETTINGS.INVALID_DATE_TIME;
        },
      },
    });
  };
}

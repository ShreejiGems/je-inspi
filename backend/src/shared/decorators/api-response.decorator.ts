import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as ApiDecorators from '@nestjs/swagger';
import {
  HttpExceptionBadRequestRO,
  HttpExceptionUnauthorizedRO,
} from '../module/common/httpException.ro';
import { COMMON_ERRORS } from '../keys/common_errors.keys';

export function CustomApiResponse(params: {
  description: string;
  type: any;
  isCreated?: boolean;
  isBadRequest?: boolean;
  isAuthorization?: boolean;
}) {
  const {
    description,
    type,
    isCreated = false,
    isBadRequest = false,
    isAuthorization = false,
  } = params;

  const mainDecorator = isCreated ? 'ApiCreatedResponse' : 'ApiOkResponse';

  return applyDecorators(
    ApiDecorators[mainDecorator]({ description, type }),
    isBadRequest
      ? ApiBadRequestResponse({
          description: COMMON_ERRORS.BAD_REQUEST.message,
          type: HttpExceptionBadRequestRO,
        })
      : ApiDecorators.ApiHideProperty(),
    isAuthorization
      ? ApiUnauthorizedResponse({
          description: COMMON_ERRORS.UNAUTHORIZED.message,
          type: HttpExceptionUnauthorizedRO,
        })
      : ApiDecorators.ApiHideProperty(),
  );
}

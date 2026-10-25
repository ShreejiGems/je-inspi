import { ApiProperty } from '@nestjs/swagger';

export class HttpExceptionUnauthorizedRO {
  @ApiProperty({
    description: 'Status code',
    example: 401,
  })
  readonly statusCode: number;

  @ApiProperty({
    description: 'Error message',
    type: 'string',
    example: 'Unauthorized',
  })
  readonly message: string;
}

export class HttpExceptionBadRequestRO {
  @ApiProperty({
    description: 'Status code',
    example: 400,
  })
  readonly statusCode: number;

  @ApiProperty({
    description: 'Error message',
    type: 'string',
    example: 'BadRequest',
  })
  readonly message: string;
}

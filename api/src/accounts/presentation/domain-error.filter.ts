import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import {
  AccountAlreadyExistsError,
  AccountHasChildrenError,
  AccountNotFoundError,
  DomainError,
} from '../domain/errors.js';

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    let status = 400;
    if (error instanceof AccountNotFoundError) status = 404;
    else if (
      error instanceof AccountAlreadyExistsError ||
      error instanceof AccountHasChildrenError
    )
      status = 409;
    res.status(status).json({ field: error.field, message: error.message });
  }
}
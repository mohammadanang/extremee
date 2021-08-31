import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Result } from '../interfaces/common.interface';

class BodyValidationMiddleware {
  verifyBodyFieldsErrors(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      const result: Result = {
        code: 400,
        status: 'error',
        message: 'body validation get errors',
        data: errors.array()
      };
      return res.status(400).send(result);
    }

    next();
  }
}

export default new BodyValidationMiddleware();

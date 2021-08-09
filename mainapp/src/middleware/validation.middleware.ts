import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import * as express from "express";
import HttpException from "../exceptions/HttpException";

function validationMiddleware<T>(
  type: any,
  skipMissingProperties = false,
  source: "body" | "query" = "body"
): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req[source]), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => {
              let errorConstrain: any = error.constraints;
              while (!errorConstrain) {
                error = error.children[0];
                errorConstrain = error.constraints;
              }
              return Object.values(error.constraints);
            })
            .join(", ");
          next(new HttpException(400, message));
        } else {
          next();
        }
      }
    );
  };
}

export default validationMiddleware;

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export type ErrorResponse = {
  message: string;
};

/**
 * Error handler
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Handle Mongoose validation error
  if (err instanceof mongoose.MongooseError) {
    console.log(
      `[${req.method}] \x1b[2m${req.originalUrl}\x1b[0m ${err.name}: ${
        (err as mongoose.MongooseError & { _message: string })._message
      }`,
    );
    res.status(500).json({ message: err.message });
    // Handle generic error
  } else if (err instanceof Error) {
    console.log(
      `[${req.method}] \x1b[2m${req.originalUrl}\x1b[0m ${err.name}: ${err.message}`,
    );
    res.status(500).json({ message: err.message });
  } else {
    console.log(`[${req.method}] \x1b[2m${req.originalUrl}\x1b[0m: ${err}`);
    res.status(500).json({ message: err });
  }
};

/**
 * Wrap async function to catch error
 */
export const asyncWrapper =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

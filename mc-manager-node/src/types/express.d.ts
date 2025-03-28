// src/types/express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: number;
        username?: string;
        role?: string;
        [key: string]: any;
      };
    }
  }
}

export type AsyncRequestHandler = (
  req: Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void | express.Response>;

export {};

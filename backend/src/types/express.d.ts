// src/types/express.d.ts
import { User } from "@prisma/client";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
}
export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

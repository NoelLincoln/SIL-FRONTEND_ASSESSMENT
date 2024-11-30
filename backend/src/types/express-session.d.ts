// express-session.d.ts
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    passport?: {
      user?: string;
    };
  }
}

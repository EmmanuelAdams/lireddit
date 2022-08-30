import {
  EntityManager,
  IDatabaseDriver,
  Connection,
} from '@mikro-orm/core';
import { Request, Response } from 'express';
// import { Session, SessionData } from 'express-session';

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: { userId: any } };
  res: Response;
};

// declare module 'express-session' {
//   interface SessionData {
//     userId: any;
//   }
// }

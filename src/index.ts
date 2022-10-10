import 'reflect-metadata';
import 'dotenv-safe/config';
import { COOKIE_NAME, __prod__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Post } from './entities/Post';
import { User } from './entities/User';
import path from 'path';
import { Updoot } from './entities/Updoot';
import { createUserLoader } from './utils/createUserLoader';
import { createUpdootLoader } from './utils/createUpdootLoader';
import * as dotenv from 'dotenv';
const corsOrigin = [
  'https://studio.apollographql.com',
  'http://localhost:3000',
];

const main = async () => {
  dotenv.config();
  const conn = await createConnection({
    type: 'postgres',
    url: 'postgresql://postgres:emmanuel2001@localhost:5432/lireddit2',
    logging: true,
    // synchronize: true,
    entities: [Post, User, Updoot],
    migrations: [path.join(__dirname, './migrations/*')],
  });
  await conn.runMigrations();

  // await Post.delete({});
  // await User.delete({});
  // await Updoot.delete({});

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis('127.0.0.1:6379');
  redis.on('connect', () =>
    console.log('Connected to Redis!')
  );
  redis.on('error', (err: Error) => {
    return console.log('Redis Client Error', err);
  });
  app.set('proxy', 1);
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? '.netlify.app' : undefined,
      },
      saveUninitialized: false,
      secret: 'qwerty',
      resave: false,
    })
  );

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        PostResolver,
        UserResolver,
      ],
      validate: false,
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
        settings: {
          'request.credentials': 'include',
        },
      }),
    ],
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000 || process.env.PORT, () => {
    console.log('server started on localhost:4000');
  });
};
main();

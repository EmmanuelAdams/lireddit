import 'reflect-metadata';
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

const main = async () => {
  dotenv.config();
  const conn = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    database: process.env.DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    ssl: {
      rejectUnauthorized: false,
    },
    port: 5432,
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
  const redis = new Redis(process.env.REDIS_URL as any, {
    password: process.env.REDIS_AUTH,
    host: process.env.REDIS_HOST,
    port: 6379,
    tls: {
      rejectUnauthorized: false,
    },
  });
  redis.on('connect', () =>
    console.log('Connected to Redis!')
  );
  redis.on('error', (err: Error) => {
    return console.log('Redis Client Error', err);
  });
  app.set('first proxy', 1);
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
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  );
  
  app.use((req, res, next) => {
  const allowedOrigin = 'https://liredddit.netlify.app';
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  return next();
});

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

  const PORT = process.env.PORT || 5000;

  app.listen({ port: PORT }, () => {
    console.log(`server started on localhost:${PORT}`);
  });
};

main();

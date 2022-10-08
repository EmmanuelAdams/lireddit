declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MIKRO_ORM_ALLOW_GLOBAL_CONTEXT: string;
      EMAIL: string;
      PASSWORD: string;
      DATABASE_URL: string;
      REDIS_URL: string;
      PORT: string;
      SESSION_SECRET: string;
    }
  }
}

export {}

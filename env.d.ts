declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EMAIL: string;
      PASSWORD: string;
      DATABASE_URL: string;
      REDIS_URL: string;
      PORT: string;
      SESSION_SECRET: string;
    }
  }
}

export {};

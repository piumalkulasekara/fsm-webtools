declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_ODATA_API_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
} 
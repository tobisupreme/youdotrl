export default () => ({
  PORT: parseInt(process.env.APP_PORT, 10) || 3456,
  CORS: {
    ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [],
  },
  DATABASE: {
    URL: process.env.DATABASE_URL,
  },
});

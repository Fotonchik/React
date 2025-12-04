export const HOST = process.env.HOST || '0.0.0.0';
// По умолчанию используем 3001, как описано в README
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
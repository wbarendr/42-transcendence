export default () => {
  // check if all required variables are there
  const required = [
    'POSTGRES_PASSWORD',
    'SESSION_SECRET',
    'USER_ENCRYPTION_SECRET',
    'OAUTH_INTRA_CLIENT_ID',
    'OAUTH_INTRA_CLIENT_SECRET',
    'OAUTH_REDIRECT',
  ];
  required.forEach((v) => {
    if (!process.env[v]) {
      throw new Error(`Environment variable ${v} is missing`);
    }
  });

  const port = parseInt(process.env.PORT) || 3000;

  return {
    port,
    cookie: {
      name: process.env.COOKIE_NAME || 'vivid.login',
    },
    useHttps: process.env.USE_HTTPS === 'true',
    saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
    db: {
      host: process.env.POSTGRES_HOST || '127.0.0.1',
      port: parseInt(<string>process.env.POSTGRES_PORT) || 5432,
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE || 'vivid',
    },
    secrets: {
      session: process.env.SESSION_SECRET,
      user: process.env.USER_ENCRYPTION_SECRET,
    },
    oauth: {
      intra: {
        clientId: process.env.OAUTH_INTRA_CLIENT_ID,
        clientSecret: process.env.OAUTH_INTRA_CLIENT_SECRET,
        callbackHost:
          process.env.OAUTH_INTRA_CALLBACK_HOST || `http://localhost:${port}`,
      },
      redirect: process.env.OAUTH_REDIRECT,
    },
  };
};

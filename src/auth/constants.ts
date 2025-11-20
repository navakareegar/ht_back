export const jwtConstants = {
  accessSecret:
    process.env.JWT_SECRET ||
    (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          '🚨 SECURITY ERROR: JWT_SECRET must be defined in production environment',
        );
      }
      console.warn(
        '⚠️  WARNING: Using default JWT_SECRET for development only. Set JWT_SECRET in .env for production!',
      );
      return 'dev-secret-CHANGE-THIS-min-32-chars-for-security';
    })(),
  refreshSecret:
    process.env.REFRESH_TOKEN_SECRET ||
    (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          '🚨 SECURITY ERROR: REFRESH_TOKEN_SECRET must be defined in production environment',
        );
      }
      console.warn(
        '⚠️  WARNING: Using default REFRESH_TOKEN_SECRET for development only. Set in .env for production!',
      );
      return 'dev-refresh-secret-CHANGE-THIS-min-32-chars';
    })(),
  accessExpiresIn: '15m',
  refreshExpiresIn: '7d',
};

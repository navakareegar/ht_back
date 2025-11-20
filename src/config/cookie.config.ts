/**
 * Secure Cookie Configuration
 * 
 * Provides environment-aware cookie settings for security
 */

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,  // Prevents JavaScript access (XSS protection)
    secure: isProduction,  // HTTPS only in production
    sameSite: (isProduction ? 'strict' : 'lax') as 'strict' | 'lax' | 'none',  // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
};

/**
 * Usage:
 * res.cookie('refresh_token', token, getCookieOptions());
 * res.clearCookie('refresh_token', getCookieOptions());
 */


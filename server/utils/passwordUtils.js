import crypto from 'crypto';

/**
 * Validate password strength — mirrors frontend rules exactly.
 * Returns array of unmet rule descriptions (empty array = strong password).
 */
export const getPasswordErrors = (password) => {
  const rules = [
    { test: (p) => p.length >= 8,                     msg: 'At least 8 characters' },
    { test: (p) => /[A-Z]/.test(p),                   msg: 'At least one uppercase letter' },
    { test: (p) => /[a-z]/.test(p),                   msg: 'At least one lowercase letter' },
    { test: (p) => /\d/.test(p),                      msg: 'At least one number' },
    { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), msg: 'At least one special character' },
  ];
  return rules.filter((r) => !r.test(password)).map((r) => r.msg);
};

/**
 * Generate a cryptographically secure reset token.
 * - rawToken    → sent to user in email link (NOT stored in DB)
 * - hashedToken → SHA-256 hash stored in DB
 * - expires     → 1 hour from now
 */
export const generateResetToken = () => {
  const rawToken    = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expires     = new Date(Date.now() + 60 * 60 * 1000);
  return { rawToken, hashedToken, expires };
};

/** Hash an incoming raw token for safe DB comparison */
export const hashToken = (rawToken) =>
  crypto.createHash('sha256').update(rawToken).digest('hex');
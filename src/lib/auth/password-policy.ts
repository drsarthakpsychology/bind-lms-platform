/**
 * New-password rules (NIST SP 800-63B, 2024 revision): length over
 * complexity, no forced symbol/number mixes, block the most common passwords.
 * Returns an error message, or null when the password is acceptable.
 */
export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 128;

const COMMON = new Set([
  "password1234", "123456789012", "qwertyuiop12", "iloveyou1234", "passwordpassword",
  "vibhapsychology", "vibha1234567", "psychology123", "welcome12345", "abcdefghijkl",
  "111111111111", "000000000000", "123123123123", "qwerty123456", "letmein12345",
]);

export function checkNewPassword(pw: string): string | null {
  if (pw.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters. Three random words work well, like "mango river lamp".`;
  }
  if (pw.length > MAX_PASSWORD_LENGTH) return `Use at most ${MAX_PASSWORD_LENGTH} characters.`;
  const lower = pw.toLowerCase();
  if (COMMON.has(lower) || /^(.)\1+$/.test(pw)) return "That password is too easy to guess. Try three random words.";
  return null;
}

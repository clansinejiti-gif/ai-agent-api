import crypto from "crypto";

export function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString();
}

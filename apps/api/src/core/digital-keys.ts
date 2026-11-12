import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { env } from "./env.js";

const algorithm = "aes-256-gcm";
const encryptionKey = Buffer.from(env.DIGITAL_KEY_ENCRYPTION_KEY, "hex");

export function encryptDigitalKey(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, encrypted].map((part) => part.toString("hex")).join(":");
}

export function decryptDigitalKey(value: string) {
  const [ivHex, authTagHex, encryptedHex] = value.split(":");
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted digital key");
  }
  const decipher = createDecipheriv(algorithm, encryptionKey, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}
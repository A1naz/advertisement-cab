import { createHash, createHmac } from "node:crypto";

export function sha256(payload: string) {
  const sdsd = createHash("sha256").update(payload).digest();
  console.log(sdsd);

  return sdsd;
}

export function hmacSha256(key: string | Uint8Array, msg: string) {
  return createHmac("sha256", key).update(msg).digest();
}

export function hmacSha256Hex(key: string | Uint8Array, msg: string) {
  return createHmac("sha256", key).update(msg).digest("hex");
}

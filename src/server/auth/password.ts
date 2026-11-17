import { argon2, randomBytes, timingSafeEqual } from "node:crypto";

/** OWASP-recommended Argon2id baseline: 19 MiB memory, 2 passes, 1 lane. */
const PARAMS = { memory: 19456, passes: 2, parallelism: 1, tagLength: 32 } as const;

function derive(password: string, salt: Buffer, params: { memory: number; passes: number; parallelism: number; tagLength: number }) {
  return new Promise<Buffer>((resolve, reject) => {
    argon2("argon2id", { message: password, nonce: salt, ...params }, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

/** Returns a PHC string: $argon2id$v=19$m=19456,t=2,p=1$<salt>$<hash> (unpadded base64). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, PARAMS);
  const b64 = (buf: Buffer) => buf.toString("base64").replace(/=+$/, "");
  return `$argon2id$v=19$m=${PARAMS.memory},t=${PARAMS.passes},p=${PARAMS.parallelism}$${b64(salt)}$${b64(key)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const match = /^\$argon2id\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/.exec(stored);
  if (!match) return false;

  const [, memory, passes, parallelism, salt, hash] = match;
  const expected = Buffer.from(hash, "base64");
  const actual = await derive(password, Buffer.from(salt, "base64"), {
    memory: Number(memory),
    passes: Number(passes),
    parallelism: Number(parallelism),
    tagLength: expected.length,
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

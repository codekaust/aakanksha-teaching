// Reads private content on stdin and writes only encrypted JSON on stdout.
import { webcrypto, randomBytes } from 'node:crypto';
let input = '';
for await (const chunk of process.stdin) input += chunk;
const { password, html } = JSON.parse(input);
const salt = randomBytes(16), iv = randomBytes(12), iterations = 600000;
const material = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ciphertext = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(html));
const b64 = bytes => Buffer.from(bytes).toString('base64');
process.stdout.write(JSON.stringify({ version: 1, iterations, salt: b64(salt), iv: b64(iv), ciphertext: b64(ciphertext) }) + '\n');

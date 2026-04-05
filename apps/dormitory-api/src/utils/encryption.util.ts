import * as crypto from "crypto";

const algorithm = "aes-256-cbc";

const secretKey = Buffer.from(process.env.LINE_CONFIG_SECRET!, "utf-8");

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
    const parts = text.split(":");

    const iv = Buffer.from(parts.shift()!, "hex");

    const encryptedText = Buffer.from(parts.join(":"), "hex");

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

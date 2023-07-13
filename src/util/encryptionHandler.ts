import crypto from "crypto";
import "dotenv/config";

const encrypt = (password: any) => {
	const iv = Buffer.from(crypto.randomBytes(16));

	const cipher = crypto.createCipheriv(
		"aes-256-ctr",
		Buffer.from(process.env["CIPHER_SECRET"] as string),
		iv
	);

	const encryptedPassword = Buffer.concat([cipher.update(password), cipher.final()]);

	return {
		iv: iv.toString("hex"),
		value: encryptedPassword.toString("hex"),
	};
};

const decrypt = (encryption: any) => {
	const decipher = crypto.createDecipheriv(
		"aes-256-ctr",
		Buffer.from(process.env["CIPHER_SECRET"] as string),
		Buffer.from(encryption.iv, "hex")
	);

	const decryptedPassword = Buffer.concat([
		decipher.update(Buffer.from(encryption.password, "hex")),
		decipher.final(),
	]);

	return decryptedPassword.toString();
};

export { encrypt, decrypt };

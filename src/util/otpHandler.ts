import { authenticator } from "otplib";

const otp = {
	tokenMaxAgeSeconds: 600, // 10m
	secret: "",

	generateSecret: () => (otp.secret = authenticator.generateSecret()),
	generateToken: (secret: string) => authenticator.generate(secret),
	verify: (token: string, secret: string) => authenticator.verify({ token, secret }),
};

authenticator.options = { step: otp.tokenMaxAgeSeconds };

export default otp;

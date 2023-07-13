import { rateLimit } from "express-rate-limit";

const loginLimiter = rateLimit({
	windowMs: 10 * 1000,
	max: 5,
	handler: (_req, res) => {
		return res.status(429).json({
			message: `Too many sign-in attempts. Try again after 10 seconds.`,
		});
	},
	standardHeaders: true,
	legacyHeaders: false,
});

const requestEmailLimiter = rateLimit({
	windowMs: 30 * 1000,
	max: 1,
	handler: (_req, res) => {
		return res.status(429).json({
			message: `Too many email requests. Try again after 30 seconds.`,
		});
	},
	standardHeaders: true,
	legacyHeaders: false,
});

export { loginLimiter, requestEmailLimiter };

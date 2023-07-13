import { Router } from "express";

import errorHandler from "@middlewares/errorHandler.middleware";
import { requestEmailLimiter } from "@middlewares/rateLimiters.middleware";
import {
	accountActivationValidator,
	emailValidator,
	otpValidator,
	passwordValidator,
	usedEmailValidator,
} from "@middlewares/validators.middleware";
import verifyJWT from "@middlewares/verifyJwt.middleware";

import UserController from "@controllers/user.controller";

export default class UserRoutes {
	public router;

	constructor(userController: UserController) {
		this.router = Router();
		this.setRoutes(userController);
	}

	private setRoutes(userController: UserController) {
		this.router.post(
			"/api/user/resend-verification-email",
			requestEmailLimiter,
			usedEmailValidator(),
			errorHandler,
			userController.resendVerificationEmail
		);

		this.router.post(
			"/api/user/activate",
			accountActivationValidator(),
			errorHandler,
			userController.activateUser
		);

		this.router.post(
			"/api/user/request-password-change",
			requestEmailLimiter,
			emailValidator(),
			errorHandler,
			userController.requestPasswordChange
		);

		this.router.post(
			"/api/user/change-password",
			[otpValidator(), emailValidator(), passwordValidator()],
			errorHandler,
			userController.changePassword
		);

		this.router.delete(
			"/api/user/delete", //
			verifyJWT,
			userController.deleteUser
		);
	}
}

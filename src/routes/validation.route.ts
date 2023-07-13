import { Router } from "express";

import errorHandler from "@middlewares/errorHandler.middleware";
import {
	otpValidator,
	passwordValidator,
	unusedEmailValidator,
	usedEmailValidator,
} from "@middlewares/validators.middleware";

import ValidationController from "@controllers/validation.controller";

export default class ValidationRoutes {
	/*
		these routes exist to provide real time data validation
	*/

	public router;

	constructor(validationController: ValidationController) {
		this.router = Router();
		this.setRoutes(validationController);
	}

	private setRoutes(validationController: ValidationController) {
		this.router.post(
			"/api/validate/register/email",
			unusedEmailValidator(),
			errorHandler,
			validationController.validateRegistrationEmail
		);

		this.router.post(
			"/api/validate/register/password",
			passwordValidator(),
			errorHandler,
			validationController.validateRegistrationPassword
		);

		this.router.post(
			"/api/validate/login/email",
			usedEmailValidator(),
			errorHandler,
			validationController.validateLoginEmail
		);

		this.router.post(
			"/api/validate/otp",
			otpValidator(),
			errorHandler,
			validationController.validateOtp
		);
	}
}

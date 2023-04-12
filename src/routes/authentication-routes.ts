import { Router } from "express";

import validateRequest from "../middlewares/validation/request-validator";
import AuthenticationController from "../controllers/authentication-controller";
import AuthenticationValidator from "../middlewares/validation/authentication-validator";
import limitLoginAttempts from "../middlewares/login-limiter";
import verifyJWT from "../middlewares/verify-jwt";

export default class AuthenticationRoutes {
	public router;

	private authController;
	private authValidator;

	constructor(authenticationController: AuthenticationController) {
		this.authController = authenticationController;
		this.authValidator = new AuthenticationValidator();

		this.router = Router();

		this.setRoutes();
	}

	private setRoutes() {
		this.router.post(
			"/api/auth/register",
			this.authValidator.validateRegistration,
			validateRequest,
			this.authController.registerUser
		);

		this.router.get(
			"/api/auth/activate/:activatorToken",
			this.authValidator.validateActivation,
			validateRequest,
			this.authController.activateUser
		);

		this.router.post(
			"/api/auth/login",
			limitLoginAttempts,
			this.authValidator.validateLogin,
			validateRequest,
			this.authController.loginUser
		);

		this.router.post(
			"/api/auth/logout", //
			this.authController.logoutUser
		);

		this.router.get(
			"/api/auth/refresh",
			this.authValidator.validateRefresh,
			validateRequest,
			this.authController.refreshToken
		);

		this.router.get(
			"/api/auth/current", //
			verifyJWT,
			this.authController.getCurrentUser
		);
	}
}
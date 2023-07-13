import { Request, Response } from "express";

import Controller from "@interfaces/controller.interface";
import ValidationRoutes from "@routes/validation.route";

export default class ValidationController implements Controller {
	public router;

	private validationRoutes;

	constructor() {
		this.validationRoutes = new ValidationRoutes(this);
		this.router = this.validationRoutes.router;
	}

	/*
		method: POST
		route: /api/validate/register/email
		access: Public
	*/
	public validateRegistrationEmail = async (_req: Request, res: Response) => {
		try {
			/*
				the validation is done through a middleware
				if we get here that means the validation is successful
			*/
			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/validate/register/password
		access: Public
	*/
	public validateRegistrationPassword = async (_req: Request, res: Response) => {
		try {
			/*
				the validation is done through a middleware
				if we get here that means the validation is successful
			*/
			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/validate/login/email
		access: Public
	*/
	public validateLoginEmail = async (_req: Request, res: Response) => {
		try {
			/*
				the validation is done through a middleware
				if we get here that means the validation is successful
			*/
			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/validate/otp
		access: Public
	*/
	public validateOtp = async (_req: Request, res: Response) => {
		try {
			/*
				the validation is done through a middleware
				if we get here that means the validation is successful
			*/
			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};
}

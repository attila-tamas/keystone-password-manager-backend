import bcrypt from "bcrypt";
import { Request, Response } from "express";

import Controller from "@interfaces/controller.interface";
import userModel from "@models/user.model";
import ValidationRoutes from "@routes/validation.route";
import otp from "@util/otpHandler";

export default class ValidationController implements Controller {
	public router;

	private user;
	private validationRoutes;

	constructor() {
		this.validationRoutes = new ValidationRoutes(this);
		this.router = this.validationRoutes.router;
		this.user = userModel;
	}

	/*
		method: POST
		route: /api/validate/register/email
		access: Public
	*/
	public validateRegistrationEmail = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;

			const foundUser = await this.user.findOne({ email }).lean().exec();

			if (foundUser) {
				return res
					.status(409)
					.json({ message: "The given email address is already in use" });
			}

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
	public validateLoginEmail = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;

			const foundUser = await this.user.findOne({ email }).lean().exec();

			if (!foundUser) {
				return res
					.status(404)
					.json({ message: "No account found with the given email address" });
			} else if (!foundUser.active) {
				return res.status(403).json({ message: "Account is not activated" });
			}

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/validate/login/password
		access: Public
	*/
	public validateLoginPassword = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			const foundUser = await this.user.findOne({ email }).lean().exec();

			if (foundUser) {
				const arePasswordsEqual = await bcrypt.compare(password, foundUser.password);

				if (!arePasswordsEqual) {
					return res.status(401).json({ message: "Incorrect password" });
				}
			}

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
	public validateOtp = async (req: Request, res: Response) => {
		try {
			const token = req.body.token;

			const isValid = otp.verify(token, otp.secret);
			if (!isValid) return res.status(403).json({ message: "Invalid or expired token" });

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};
}

import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { sender, transport } from "@config/mailService";
import AccountActivationEmailTemplate from "@templates/accountActivationEmailTemplate";
import PasswordChangeRequestEmailTemplate from "@templates/passwordChangeEmailTemplate";

import Controller from "@interfaces/controller.interface";
import keyModel from "@models/key.model";
import userModel from "@models/user.model";
import UserRoutes from "@routes/user.route";
import otp from "@util/otpHandler";

export default class UserController implements Controller {
	public router;

	private user;
	private key;
	private userRoutes;
	private transport;

	constructor() {
		this.userRoutes = new UserRoutes(this);
		this.router = this.userRoutes.router;
		this.user = userModel;
		this.key = keyModel;
		this.transport = transport;
	}

	/*
		method: POST
		route: /api/auth/resend-verification-email
		access: Public
	*/
	public resendVerificationEmail = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;
			const user = matchedData(req); // we are finding the user in the registration validator middleware

			await this.transport.send({
				to: email,
				from: sender,
				subject: "Account activation",
				html: AccountActivationEmailTemplate(user?.["activatorToken"]),
			});

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/auth/activate
		access: Public
	*/
	public activateUser = async (req: Request, res: Response) => {
		try {
			const activatorToken = req.body.activatorToken;

			await this.user.updateOne(
				{ activatorToken },
				{ $unset: { activatorToken }, $set: { active: true } }
			);

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/user/request-password-change
		access: Public
	*/
	public requestPasswordChange = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;

			const secret = otp.generateSecret();
			const token = otp.generateToken(secret);

			await this.transport.send({
				to: email,
				from: sender,
				subject: "Password change request",
				html: PasswordChangeRequestEmailTemplate(token, otp.tokenMaxAgeSeconds),
			});

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/user/change-password
		access: Public
	*/
	public changePassword = async (req: Request, res: Response): Promise<any> => {
		try {
			const { email, password } = req.body;
			const newPassword = await bcrypt.hash(password, 10);

			await this.user.updateOne({ email }, { $set: { password: newPassword } });

			// make the current token one-time use only
			// generating a new secret will make the current token fail on verification
			otp.generateSecret();

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: DELETE
		route: /api/user/delete
		access: Protected
	*/
	public deleteUser = async (req: Request, res: Response) => {
		try {
			const userId = (<any>req).user.id;

			await this.user.findByIdAndDelete({ _id: userId }).exec();

			await this.key.deleteMany({ userId }).exec();

			res.clearCookie("jwt", {
				httpOnly: true,
				// secure: true,
				sameSite: "none",
			});

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};
}

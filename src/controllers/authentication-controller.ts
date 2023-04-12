import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import "dotenv/config";

import userModel from "../models/user-model";
import Controller from "../interfaces/controller-interface";
import AuthenticationRoutes from "../routes/authentication-routes";

export default class AuthenticationController implements Controller {
	public router;

	private user;
	private authRoutes;
	private transport;

	constructor() {
		this.authRoutes = new AuthenticationRoutes(this);
		this.router = this.authRoutes.router;

		this.user = userModel;

		this.transport = nodemailer.createTransport({
			host: process.env["TRANSPORT_HOST"],
			port: Number(process.env["TRANSPORT_PORT"]),
			auth: {
				user: process.env["TRANSPORT_AUTH_USER"],
				pass: process.env["TRANSPORT_AUTH_PASS"],
			},
		});
	}

	// @route /api/auth/register
	// @access Public
	public registerUser = async (req: Request, res: Response) => {
		try {
			const { username, email } = req.body;
			const password = await bcrypt.hash(req.body.password, 10);
			const activatorToken = uuidv4();

			const createdUser = await this.user.create({
				username,
				email,
				password,
				activatorToken,
			});

			await this.transport
				.sendMail({
					from: "address@example.com",
					to: email,
					subject: "Account activation",
					html: `
					<h3>Account activation</h3>
					<p>
						Click on this link to activate your account: http://localhost:5000/api/auth/activate/${createdUser.activatorToken}
					</p>`,
				})
				.then(message => {
					console.log(
						"View account activation email: %s",
						nodemailer.getTestMessageUrl(message)
					);
				});

			return res.status(200).json({ message: `New user '${createdUser.username}' created` });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route /api/auth/activate/:activatorToken
	// @access Public
	public activateUser = async (req: Request, res: Response) => {
		try {
			const activatorToken = req.params["activatorToken"];

			await this.user.updateOne(
				{ activatorToken },
				{ $unset: { activatorToken }, $set: { active: true } }
			);

			return res.status(200).json({ message: "Account activated" });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route /api/auth/login
	// @access Public
	public loginUser = async (req: Request, res: Response) => {
		try {
			const username = req.body.username;

			const user = await this.user.findOne({ username }).exec();

			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: user?.username,
					},
				},
				process.env["ACCESS_TOKEN_SECRET"] as string,
				{ expiresIn: "10s" }
			);

			const refreshToken = jwt.sign(
				{ username: user?.username },
				process.env["REFRESH_TOKEN_SECRET"] as string,
				{ expiresIn: "1d" }
			);

			res.cookie("jwt", refreshToken, {
				httpOnly: true,
				// secure: true,
				sameSite: "none",
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			});

			return res.status(200).json({ accessToken });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route /api/auth/logout
	// @access Public
	public logoutUser = async (req: Request, res: Response) => {
		try {
			const jwt = req.cookies.jwt;

			if (jwt) {
				res.clearCookie("jwt", { httpOnly: true, /*secure: true,*/ sameSite: "none" });
			}

			return res.status(200).json({ message: "User logged out" });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route /api/auth/refresh
	// @access Public
	public refreshToken = async (req: Request, res: Response): Promise<any> => {
		try {
			const cookies = req.cookies;
			const refreshToken = cookies.jwt;

			jwt.verify(
				refreshToken,
				process.env["REFRESH_TOKEN_SECRET"] as string,
				async (error: any, decoded: any) => {
					if (error) {
						return res.status(400).json({ message: "Forbidden" });
					}

					const user = await this.user.findOne({ username: decoded.username }).exec();

					if (!user) {
						return res.status(400).json({ message: "Unauthorized" });
					}

					const accessToken = jwt.sign(
						{
							UserInfo: {
								username: user.username,
							},
						},
						process.env["ACCESS_TOKEN_SECRET"] as string,
						{ expiresIn: "10s" }
					);

					return res.status(200).json({ accessToken });
				}
			);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route /api/auth/current
	// @access Protected
	public getCurrentUser = async (req: Request, res: Response) => {
		try {
			return res.status(200).json((<any>req).user);
		} catch (error: any) {
			return res.status(500).json({ error: error.message });
		}
	};
}
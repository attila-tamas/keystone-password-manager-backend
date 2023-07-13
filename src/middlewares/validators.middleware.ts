import otp from "@util/otpHandler";
import bcrypt from "bcrypt";
import { body, cookie, query } from "express-validator";

import Entry from "@models/entry.model";
import User from "@models/user.model";

const emailValidator = () =>
	body("email")
		.notEmpty()
		.withMessage("The email address must not be empty")

		.isEmail()
		.withMessage("Invalid email address");

const unusedEmailValidator = () =>
	emailValidator() //
		.custom(async email => {
			const foundUser = await User.findOne({ email }).lean().exec();

			if (foundUser) {
				throw new Error("Email address is already in use");
			}
		});

const usedEmailValidator = () =>
	emailValidator() //
		.custom(async email => {
			const foundUser = await User.findOne({ email }).exec();

			if (!foundUser) {
				throw new Error("Email address is not registered");
			}
		});

const loginValidator = () =>
	body() //
		.custom(async ({ email, password }) => {
			const foundUser = await User.findOne({ email }).exec();

			if (foundUser) {
				const arePasswordsEqual = await bcrypt.compare(password, foundUser.password);

				if (!arePasswordsEqual) {
					throw new Error("Incorrect password");
				}
			}
		});

const passwordValidator = () =>
	body("password")
		.trim()

		.notEmpty()
		.withMessage("The password must not be empty")

		.custom(async password => {
			const hasLowercase = password.toUpperCase() != password;
			if (!hasLowercase) throw new Error("The password must contain lowercase letters");

			const hasUppercase = password.toLowerCase() != password;
			if (!hasUppercase) throw new Error("The password must contain uppercase letters");

			const hasNumber = /\d/.test(password);
			if (!hasNumber) throw new Error("The password must contain numbers");

			const hasSpecialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
			if (!hasSpecialChars) throw new Error("The password must contain special characters");
		})

		.isLength({ min: 12 })
		.withMessage("The password must be at least 12 characters");

const accountActivationValidator = () => [
	body("token")
		.trim()

		.notEmpty()
		.withMessage("The verification code must not be empty"),

	emailValidator() //
		.custom(async email => {
			const foundUser = await User.findOne({ email }).exec();

			if (foundUser?.active) {
				throw new Error("Account is already activated");
			}
		}),
];

const otpValidator = () =>
	body("token")
		.trim()

		.notEmpty()
		.withMessage("The verification code must not be empty")

		.custom(async token => {
			const isValid = otp.verify(token, otp.secret);

			if (!isValid) {
				throw new Error("Invalid or expired code");
			}
		});

const cookieValidator = () =>
	cookie("jwt") //
		.trim()

		.notEmpty()
		.withMessage("Unauthorized");

const titleValidator = () =>
	body("title")
		.trim()

		.notEmpty()
		.withMessage("The title must not be empty");

const paginationValidator = () => [
	// replace the value of the field if it's either an empty string, null, undefined, or NaN.
	query("page").default(1),
	query("limit").default(10),
	query("sort").default("title"),
	query("asc").default(1),
];

const idValidator = () =>
	body("id")
		.trim()

		.custom(async (_id, { req }) => {
			// check if the _id is a valid ObjectId
			if (_id.match(/^[0-9a-fA-F]{24}$/)) {
				const entry = await Entry.findOne({ _id, userId: (<any>req).user.id })
					.lean()
					.exec();

				if (!entry) {
					throw new Error("Entry not found");
				}
			} else {
				throw new Error("Invalid id");
			}
		});

export {
	emailValidator,
	unusedEmailValidator,
	usedEmailValidator,
	loginValidator,
	passwordValidator,
	accountActivationValidator,
	otpValidator,
	cookieValidator,
	titleValidator,
	paginationValidator,
	idValidator,
};

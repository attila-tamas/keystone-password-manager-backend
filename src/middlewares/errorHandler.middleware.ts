import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const errorHandler = (req: Request, res: Response, next: NextFunction) => {
	const result = validationResult(req).array();

	if (result.length) {
		const error = result[0]?.msg;
		return res.status(409).json({ message: error });
	}

	return next();
};

export default errorHandler;

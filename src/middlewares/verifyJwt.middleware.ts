import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyJWT = (req: Request, res: Response, next: NextFunction): any => {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const accessToken = authHeader.split(" ")[1];

	jwt.verify(
		accessToken as string,
		process.env["ACCESS_TOKEN_SECRET"] as string,
		(error: any, decoded: any) => {
			if (error) {
				return res.status(403).json({ message: "Forbidden" });
			}

			(<any>req).user = decoded.userInfo;

			return next();
		}
	);
};

export default verifyJWT;

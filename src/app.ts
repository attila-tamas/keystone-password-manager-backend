import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import mongoose from "mongoose";

import "dotenv/config";

import corsOptions from "@config/corsOptions";
import Controller from "@interfaces/controller.interface";

export default class App {
	private app: Application;

	constructor(controllers: Controller[]) {
		this.app = express();
		this.setMiddlewares();
		this.setRoutes(controllers);
		this.connectToTheDatabase();
	}

	private setMiddlewares() {
		this.app.use(express.json());
		this.app.use(cookieParser());
		this.app.use(cors(corsOptions));
	}

	private setRoutes(controllers: Controller[]) {
		controllers.forEach(controller => {
			this.app.use("/", controller.router);
		});
	}

	private connectToTheDatabase() {
		mongoose
			.connect(process.env["MONGO_URI"] as string)
			.then(() => {
				this.listen(process.env["PORT"]);
			})
			.catch(error => {
				console.log(error);
			});
	}

	private listen(port: string | undefined) {
		if (!port) {
			throw new Error("Port is undefined");
		} else {
			this.app.listen(port, () => {
				console.log("The server is listening on port", port);
			});
		}
	}
}

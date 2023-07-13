import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { decrypt, encrypt } from "@util/encryptionHandler";

import Controller from "@interfaces/controller.interface";
import entryModel from "@models/entry.model";
import EntryRoutes from "@routes/entry.route";

export default class EntryController implements Controller {
	public router;

	private entry;
	private entryRoutes;

	constructor() {
		this.entryRoutes = new EntryRoutes(this);
		this.router = this.entryRoutes.router;
		this.entry = entryModel;
	}

	/*
		method: POST
		route: /api/entry/new
		access: Protected
	*/
	public createNewEntry = async (req: Request, res: Response) => {
		try {
			const { password, title, customFields } = req.body;
			const encryptedPassword = encrypt(password);

			await this.entry.create({
				userId: (<any>req).user.id,
				password: {
					value: encryptedPassword.value,
					iv: encryptedPassword.iv,
				},
				title,
				customFields: [...customFields],
			});

			return res.status(201).json({ message: "New entry created" });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: GET
		route: /api/entry?keyword=...&page=...&limit=...&sort=...&asc=...
		access: Protected

		on "/api/entry" route it defaults to { keyword: '', page: '1', limit: 10, sort: 'title', asc: 1 }
	*/
	public getPaginatedEntriesByKeyword = async (req: Request, res: Response) => {
		try {
			const filterRegex = new RegExp(req.query["keyword"] as string, "i");
			const { page, limit, sort, asc } = matchedData(req);
			const previousData = (page - 1) * limit;

			const filteredEntries = await this.entry
				.find({
					userId: (<any>req).user.id,
					$or: [
						{ title: filterRegex },
						{ "customFields.key": filterRegex },
						{ "customFields.value": filterRegex },
					],
				})
				.sort({ [sort]: asc })
				.skip(previousData)
				.limit(limit)
				.exec();

			const responseData = filteredEntries.map((entry: any) => {
				return {
					id: entry._id,
					password: decrypt({
						password: entry.password.value,
						iv: entry.password.iv,
					}),
					title: entry.title,
					customFields: entry.customFields,
				};
			});

			return res.status(200).json(responseData);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: PATCH
		route: /api/entry/update
		access: Protected
	*/
	public updateEntry = async (req: Request, res: Response) => {
		try {
			const { id, password, title, customFields } = req.body;
			const encryptedPassword = encrypt(password);

			const updatedData = {
				password: {
					value: encryptedPassword.value,
					iv: encryptedPassword.iv,
				},
				title,
				customFields,
			};

			await this.entry.findByIdAndUpdate({ _id: id }, updatedData, { new: true }).exec();

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: DELETE
		route: /api/entry/delete
		access: Protected
	*/
	public deleteEntry = async (req: Request, res: Response) => {
		try {
			const id = req.body.id;

			await this.entry.findByIdAndDelete(id).exec();

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: DELETE
		route: /api/entry/delete/all
		access: Protected
	*/
	public deleteAllEntriesByUserId = async (req: Request, res: Response) => {
		try {
			await this.entry.deleteMany({ userId: (<any>req).user.id }).exec();

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};
}

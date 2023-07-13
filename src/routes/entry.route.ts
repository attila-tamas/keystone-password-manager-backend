import { Router } from "express";

import errorHandler from "@middlewares/errorHandler.middleware";
import {
	idValidator,
	paginationValidator,
	passwordValidator,
	titleValidator,
} from "@middlewares/validators.middleware";
import verifyJWT from "@middlewares/verifyJwt.middleware";

import EntryController from "@controllers/entry.controller";

export default class EntryRoutes {
	public router;

	constructor(entryController: EntryController) {
		this.router = Router();
		this.setRoutes(entryController);
	}

	private setRoutes(entryController: EntryController) {
		this.router.post(
			"/api/entry/new",
			verifyJWT,
			[titleValidator(), passwordValidator()],
			errorHandler,
			entryController.createNewEntry
		);

		/*
			route: /api/entry?keyword=...&page=...&sort=...&asc=...
			default: { keyword: '', page: '1', limit: 10, sort: 'title', asc: 1 }
		*/
		this.router.get(
			"/api/entry",
			verifyJWT,
			paginationValidator(),
			errorHandler,
			entryController.getPaginatedEntriesByKeyword
		);

		this.router.patch(
			"/api/entry/update",
			verifyJWT,
			[idValidator(), titleValidator(), passwordValidator()],
			errorHandler,
			entryController.updateEntry
		);

		this.router.delete(
			"/api/entry/delete",
			verifyJWT,
			idValidator(),
			errorHandler,
			entryController.deleteEntry
		);

		this.router.delete(
			"/api/entry/delete/all", //
			verifyJWT,
			entryController.deleteAllEntriesByUserId
		);
	}
}

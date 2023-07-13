import App from "./app";

import AuthenticationController from "@controllers/authentication.controller";
import EntryController from "@controllers/entry.controller";
import UserController from "@controllers/user.controller";
import ValidationController from "@controllers/validation.controller";

new App([
	new AuthenticationController(),
	new ValidationController(),
	new EntryController(),
	new UserController(),
]);

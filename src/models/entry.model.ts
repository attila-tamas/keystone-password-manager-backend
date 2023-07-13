import { model, Schema } from "mongoose";

const entrySchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		password: {
			value: {
				type: String,
				required: true,
			},
			iv: {
				type: String,
				required: true,
			},
		},
		title: {
			type: String,
			required: true,
		},
		customFields: [
			{
				type: Object,
			},
		],
	},
	{ versionKey: false }
);

const entryModel = model("Entry", entrySchema);

export default entryModel;

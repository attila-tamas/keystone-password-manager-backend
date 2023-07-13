import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env["SENDGRID_API_KEY"] as string);

const sender = process.env["SENDGRID_SENDER"] as string;

export default {
	sendEmail: async (to: string, subject: string, htmlTemplate: any) => {
		new Promise<boolean>((resolve, _reject) => {
			const msg = {
				from: sender,
				to: to,
				subject: subject,
				html: htmlTemplate,
			};
			sgMail.send(msg).then(() => {
				resolve(true);
			});
		});
	},
};

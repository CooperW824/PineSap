import nodemailer from "nodemailer";

export interface EmailSender {
	/**
	 * Sends an email with the specified subject and body to the given email address.
	 *
	 * @param to The email address to send the message to.
	 * @param subject The subject of the email.
	 * @param body The body of the email. This can contain HTML content.
	 * @returns A promise that resolves when the email is sent. Will reject if there is an error sending the email.
	 */
	sendEmail: (to: string, subject: string, body: string) => Promise<void>;
}

/**
 * Mock Emailer for Unit Testing
 */
export class MockEmailSender implements EmailSender {
	latestEmail: { to: string; subject: string; body: string } | null = null;

	async sendEmail(to: string, subject: string, body: string): Promise<void> {
		this.latestEmail = { to, subject, body };
		console.log("MockEmailSender: Email sent", this.latestEmail);
	}

	getLatestEmail() {
		return this.latestEmail;
	}
}

export class GmailEmailSender implements EmailSender {
	private transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.AUTH_GMAIL_EMAIL,
				pass: process.env.AUTH_GMAIL_PASSWORD,
			},
		});
	}

	async sendEmail(to: string, subject: string, body: string): Promise<void> {
		try {
			await this.transporter.sendMail({
				from: `PineSap Auth <${process.env.AUTH_GMAIL_EMAIL}>`,
				to,
				subject,
				html: body,
			});
			console.log(`Email sent to ${to} with subject "${subject}"`);
		} catch (error) {
			console.error(`Error sending email to ${to}:`, error);
			throw new Error(`Failed to send email to ${to}`);
		}
	}
}

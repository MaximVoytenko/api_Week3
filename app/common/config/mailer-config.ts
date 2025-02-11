import nodemailer from "nodemailer";
import { logger } from "./pino-plugin";

const transporter = nodemailer.createTransport({
    service: "yandex",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

export async function sendEmail(options: EmailOptions) {
    try {
        await transporter.sendMail({
            from: `"Your App" <${process.env.EMAIL_USER}>`,
            ...options
        });
    } catch (error) {
        logger.error("Error sending email:", error);
        throw error;
    }
}

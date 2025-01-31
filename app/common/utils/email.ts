import nodemailer from "nodemailer";

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
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

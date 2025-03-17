'use server'
import { createTransport } from "nodemailer"

export async function sendEmail(email: string, body: string, subject: string) {
    try {

        const transporter = createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from: 'Ankit from Smart Study',
            to: `${email}`,
            subject: `${subject}`,
            html: `${body}`
        })

        // console.log(info);S

        return info;

    } catch (error) {
        console.log(error);
    }
}
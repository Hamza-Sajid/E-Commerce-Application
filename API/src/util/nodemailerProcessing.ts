// config/nodemailer.ts
import nodemailer from 'nodemailer';

const HOST_SERVICE = process.env.HOST_SERVICE;
const HOST = process.env.HOST;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

const transporter = nodemailer.createTransport({
    service: HOST_SERVICE,
    host: HOST,
    port: 587,
    secure: false,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});

export const sendEmail = async (to: any, subject: any, htmlPromise: Promise<string>) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const htmlCode = await htmlPromise;

            const mailOptions = {
                from: MAIL_USER,
                to: to,
                subject: subject,
                html: htmlCode,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`Error sending email: ${error}`);
                    reject(error);
                } else {
                    console.log(`Email sent: ${info.response}`);
                    resolve();
                }
            });
        } catch (error) {
            console.error(`Error occurred: ${error}`);
            reject(error);
        }
    });
};
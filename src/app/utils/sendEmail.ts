import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {

    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com.",
        port: 587,
        secure: config.NODE_ENV === 'production',
        auth: {
            user: "mahedyhasan766584@gmail.com",
            pass: "ljkp zdbq gwtj rmmw",
        },
    });

    await transporter.sendMail({
        from: 'mahedyhasan766584@gmail.com',
        to,
        subject: "Reset your password within 10 mins!",
        text: "Reset your password within 10 mins!", // plain‑text body
        html, // HTML body

    });

};
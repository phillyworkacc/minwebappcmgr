"use server"
import nodemailer from "nodemailer";

export async function sendMinwebEmail (subject: string, body: string) {
   const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
         user: 'agencyminweb@gmail.com',
         pass: process.env.GOOGLE_APP_PASSWORD!
      },
   });

   await transporter.sendMail({
      from: `"Minweb Agency" <agencyminweb@gmail.com>`,
      to: "ayomiposi.opadijo@gmail.com",
      subject: subject,
      html: body
   });
}
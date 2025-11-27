"use server"
import nodemailer from "nodemailer";

export default async function sendMail (to: string, subject: string, content: string) {
   try {
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
         to, subject, html: content
      });
      return true;
   } catch (e) {
      return false;
   }

}
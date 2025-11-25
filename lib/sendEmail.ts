"use server"
import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string) {
   try {
      const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: 'agencyminweb@gmail.com',
            pass: process.env.GOOGLE_APP_PASSWORD!
         },
      });
   
      await transporter.sendMail({
         from: `"Minweb Agency" <agencyminweb@gmail.com>`,
         to, subject, html: text
      });
      return true;
   } catch (e) {
      return false;
   }
}
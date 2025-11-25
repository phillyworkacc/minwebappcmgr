"use server"
import nodemailer from "nodemailer";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendEmail({ subject, text }) {
//    await resend.emails.send({
//       from: "CMS <noreply@grxnd.com>",
//       to: "your-email@example.com",
//       subject,
//       text,
//    });
// }


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
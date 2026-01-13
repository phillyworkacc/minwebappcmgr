"use server"
import twilio from "twilio";

export async function sendSMSMessage (receivingPhoneNumber: string, message: string) {
   try {
      if (!process.env.TWILIO_ACCOUNT_SID) return {
         success: false,
         error: "NO ACCOUNT SID"
      }
      
      if (!process.env.TWILIO_AUTH_TOKEN) return {
         success: false,
         error: "NO AUTH TOKEN"
      }

      const twilioPhoneNumber = "+447727653159";
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      const result = await client.messages.create({
         body: message,
         from: twilioPhoneNumber,
         to: receivingPhoneNumber,
      })

      return {
         success: true,
         result: `SMS Message sent to ${receivingPhoneNumber}`
      }
   } catch (e) {
      console.error(e)
      return {
         success: false,
         error: "Failed to send sms message"
      }
   }
}
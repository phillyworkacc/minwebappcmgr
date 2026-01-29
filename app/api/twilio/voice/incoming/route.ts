import { getClientFromTwilioPhone } from "@/app/actions/clients";
import { NextRequest } from "next/server";
import twilio from "twilio";

export async function POST (req: NextRequest) {
   const formData = await req.formData();

   const to = formData.get("To") as string;     // Twilio number
   const from = formData.get("From") as string; // Customer number

   // lookup client by Twilio number
   const client = await getClientFromTwilioPhone(to);
   const twiml = new twilio.twiml.VoiceResponse();

   if (!client) {
      twiml.say("Sorry, we cannot take your call right now.");
      return new Response(twiml.toString(), {
         headers: { "Content-Type": "text/xml" },
      });
   }

   // forward call to client phone number
   const dial = twiml.dial({
      timeout: 20,
      callerId: client.twilioPhoneNumber!,
      record: "do-not-record",
   });

   dial.number(
      {
         statusCallback: `https://app.minwebagency.com/api/twilio/voice/status?customer=${encodeURIComponent(from)}`,
         statusCallbackEvent: ["completed"],
         statusCallbackMethod: "POST",
      },
      client.phoneNumber!
   );

   return new Response(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
   });
}
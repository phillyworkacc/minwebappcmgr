import { NextRequest } from "next/server";
import twilio from "twilio";

// IMPORTANT: force Node runtime
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
   const formData = await req.formData();

   const to = formData.get("To") as string;     // Twilio number
   const from = formData.get("From") as string; // Customer number

   // TODO: lookup client by Twilio number
   // Example:
   const client = {
      phoneNumber: "+447599899541", // client's real phone
   };

   const twiml = new twilio.twiml.VoiceResponse();

   twiml.dial(
      {
         timeout: 20,
         statusCallback: `${process.env.NEXTAUTH_URL}/api/twilio/voice/status`,
         statusCallbackEvent: ["completed"],
         statusCallbackMethod: "POST",
      } as any,
      client.phoneNumber
   );

   return new Response(twiml.toString(), {
      status: 200,
      headers: {
         "Content-Type": "text/xml",
      },
   });
}

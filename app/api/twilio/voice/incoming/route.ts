import { NextRequest } from "next/server";
import twilio from "twilio";

export async function POST (req: NextRequest) {
   // const formData = await req.formData();

   // const to = formData.get("To") as string;     // Twilio number
   // const from = formData.get("From") as string; // Customer number

   // TODO: lookup client by Twilio number
   // Example:
   const client = {
      phoneNumber: "+447599899541", // client's real phone
   };

   const twiml = new twilio.twiml.VoiceResponse();

   // 2️⃣ Safety fallback
   // if (!client || !client.phoneNumber) {
   //    twiml.say("Sorry, we cannot take your call right now.");
   //    return new Response(twiml.toString(), {
   //       headers: { "Content-Type": "text/xml" },
   //    });
   // }
   const twilioPhoneNumber = "+447727653159";

   // forward call to client phone number
   const dial = twiml.dial({
      timeout: 20,
      callerId: twilioPhoneNumber,
      record: "do-not-record",
   });

   dial.number(
      {
         statusCallback: `https://app.minwebagency.com/api/twilio/voice/status`,
         statusCallbackEvent: ["completed"],
         statusCallbackMethod: "POST",
      },
      client.phoneNumber
   );
   
   // twiml.dial(
   //    {
   //       timeout: 20,
   //       callerId: "+447727653159",
   //       record: "do-not-record",
   //       statusCallback: `https://app.minwebagency.com/api/twilio/voice/status`,
   //       statusCallbackEvent: ["completed"],
   //       statusCallbackMethod: "POST",
   //    },
   //    client.phoneNumber
   // );

   return new Response(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
   });

   // twiml.dial(
   //    {
   //       timeout: 20,
   //       record: "do-not-record",
   //       callerId: "+447727653159",
   //       statusCallback: `https://app.minwebagency.com/api/twilio/voice/status`,
   //       statusCallbackEvent: ["completed"],
   //       statusCallbackMethod: "POST",
   //    } as any,
   //    client.phoneNumber
   // );

   // return new Response(twiml.toString(), {
   //    status: 200,
   //    headers: {
   //       "Content-Type": "text/xml",
   //    },
   // });
}
import { NextRequest } from "next/server";
import twilio from "twilio";

export const runtime = "nodejs";

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: NextRequest) {
   const formData = await req.formData();

   const dialStatus = formData.get("DialCallStatus") as string;
   const from = formData.get("From") as string; // customer
   const to = formData.get("To") as string;     // Twilio number

   // Only text back if NOT answered
   if (dialStatus !== "completed") {
      // TODO: rate-limit (one SMS per X mins per number)

      // TODO: lookup client by Twilio number
      const clientData = {
         businessName: "Joe's Plumbing",
         twilioPhoneNumber: "+447727653159",
      };

      await client.messages.create({
         from: clientData.twilioPhoneNumber,
         to: from,
         body: `Sorry we missed your call to ${clientData.businessName}. How can we help?`,
      });

      // TODO: log message + conversation
   }

   return new Response("OK", { status: 200 });
}

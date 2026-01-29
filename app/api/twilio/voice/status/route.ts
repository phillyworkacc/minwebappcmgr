import { getClientFromTwilioPhone } from "@/app/actions/clients";
import { sendMinwebEmail } from "@/app/actions/email";
import { createNewMessageUpsertConversation } from "@/app/actions/twilio-sms";
import { NextRequest } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST (req: NextRequest) {
   const customer = new URL(req.url).searchParams.get("customer");
   if (!customer) {
      return new Response("Fail", { status: 500 });
   }
      
   const formData = await req.formData();
   const dialStatus = formData.get("DialCallStatus") as string;
   const from = formData.get("From") as string; // customer
   const to = formData.get("To") as string;     // Twilio number

   // Only text back if NOT answered
   if (dialStatus !== "completed") {
      // TODO: rate-limit (one SMS per X mins per number)

      // lookup client by Twilio number
      const clientData = await getClientFromTwilioPhone(to);
      await sendMinwebEmail("Call Forwarding", `Client Data: ${clientData!} <br />Twilio Phone Number: ${to}`);
      if (!clientData) return new Response("No client", { status: 500 });

      const message = `Sorry we missed your call to ${clientData.businessName!}. How can we help?`;

      await client.messages.create({
         from: from,
         to: customer!,
         body: message,
      });

      const createMsgConvo = await createNewMessageUpsertConversation(clientData.clientid!, message, {
         customerName: `Unknown (${from.slice(-4)})`, customerPhone: from
      }, "out");
   }

   return new Response("OK", { status: 200 });
}

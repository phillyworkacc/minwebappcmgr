import { getClientFromPhoneNumber } from "@/app/actions/clients";
import { getLastAutoReply, updateLastAutoReply } from "@/app/actions/extras";
import { createNewMessageUpsertConversation } from "@/app/actions/twilio-sms";
import { NextRequest } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST (req: NextRequest) {
   try {
      const customer = new URL(req.url).searchParams.get("customer");
      if (!customer) {
         return new Response("Fail", { status: 500 });
      }
         
      const formData = await req.formData();
      const dialStatus = formData.get("DialCallStatus") as string;
      const duration = parseInt(formData.get("DialCallDuration") as string || "0");
      const from = formData.get("From") as string; // customer
      const to = formData.get("To") as string;     // Actual Client Phone number
   
      console.log(`dial status: ${dialStatus}`);
      console.log(`dial status: ${duration}`);
      console.log(`from: ${from}`);
      console.log(`to: ${to}`);
      console.log(`customer: ${customer}`);
      
      // const isMissed = dialStatus !== "completed" || duration < 5;
      const isMissed = (dialStatus === "no-answer" || dialStatus === "busy" || dialStatus === "failed" || (dialStatus === "completed" && duration < 5));
      if (!isMissed) return new Response("Call answered", { status: 200 });
      
      console.log(`call missed: ${isMissed}`);
      
      // Only text back if NOT answered
      if (isMissed) {
         // rate-limit (one SMS per 10 mins per number)
         const autoReplyRateLimitTime = 10 * 60 * 1000; // 10 minutes
         const lastReply = await getLastAutoReply(customer);
         
         if (lastReply && ((Date.now() - parseInt(lastReply.lastSentAt)) < autoReplyRateLimitTime)) {
            console.log(`Rate limited for ${customer}`);
            return new Response("Rate limited", { status: 200 });
         }
   
         // lookup client by Actual Client Phone number
         const clientData = await getClientFromPhoneNumber(to);
         if (!clientData) return new Response("No client", { status: 500 });
   
         const message = `Sorry we missed your call to ${clientData.businessName!}. How can we help?`;
   
         await client.messages.create({
            from: from,
            to: customer!,
            body: message,
         });
   
         const createMsgConvo = await createNewMessageUpsertConversation(clientData.clientid!, message, {
            customerName: `Unknown (${from.slice(-4)})`, customerPhone: customer
         }, "out");
         if (createMsgConvo) {
            await updateLastAutoReply(customer);
         } else {
            console.log(`Failed to send message or create conversation for ${customer}`)
         }
      }
   
      console.log("Missed Call Text Back Sent");
      return new Response("OK", { status: 200 });
   } catch (e) {
      return new Response("Fail", { status: 500 });
   }
}
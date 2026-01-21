import { NextRequest } from "next/server";
import twilio from "twilio";

export const runtime = "nodejs";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { clientId, name, phone, service, message } = body;

  // TODO: lookup client by clientId
  const client = {
    businessName: "Joe's Plumbing",
    twilioPhoneNumber: "+447480000001"
  };

  const smsBody = `New quote request 🔔
Name: ${name}
Phone: ${phone}
Service: ${service}
Message: "${message}"`;

  await twilioClient.messages.create({
    from: client.twilioPhoneNumber,
    to: client.twilioPhoneNumber, // goes into SMS inbox
    body: smsBody
  });

  // Optional auto-reply to customer
  await twilioClient.messages.create({
    from: client.twilioPhoneNumber,
    to: phone,
    body: `Thanks for contacting ${client.businessName}! We’ll text you shortly.`
  });

  // TODO:
  // - upsert conversation
  // - insert lead
  // - insert message

  return new Response("OK", { status: 200 });
}

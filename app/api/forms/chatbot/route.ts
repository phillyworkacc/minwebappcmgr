import { NextRequest } from "next/server";
import twilio from "twilio";

export const runtime = "nodejs";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { twilioPhoneNumber, customerPhone, message } = body;

  // TODO: lookup client by twilioPhoneNumber
  const client = {
    businessName: "Prime Driveways"
  };

  // Send message into client SMS inbox
  await twilioClient.messages.create({
    from: twilioPhoneNumber,
    to: twilioPhoneNumber,
    body: `Website chat 💬
From: ${customerPhone}
Message: "${message}"`
  });

  // Bot reply to customer
  await twilioClient.messages.create({
    from: twilioPhoneNumber,
    to: customerPhone,
    body: `Thanks for messaging ${client.businessName}! A member of our team will text you shortly.`
  });

  // TODO:
  // - create/find conversation
  // - log messages
  // - mark source = chatbot

  return new Response("OK", { status: 200 });
}

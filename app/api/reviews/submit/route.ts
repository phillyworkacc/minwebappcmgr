import { NextRequest } from "next/server";
import twilio from "twilio";

export const runtime = "nodejs";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { clientId, customerName, rating, feedback } = body;

  // TODO: lookup client
  const client = {
    businessName: "BrightSpark Electrical",
    twilioPhoneNumber: "+447480000003"
  };

  // Only alert on bad reviews
  if (rating <= 3) {
    await twilioClient.messages.create({
      from: client.twilioPhoneNumber,
      to: client.twilioPhoneNumber,
      body: `⚠️ New low review (${rating}⭐)
Customer: ${customerName}
Feedback: "${feedback}"`
    });
  }

  // TODO:
  // - store review
  // - show in dashboard
  // - DO NOT send public review link

  return new Response("OK", { status: 200 });
}

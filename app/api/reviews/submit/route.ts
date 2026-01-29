import { getClientFromClientId } from "@/app/actions/clients";
import { sendSMSMessage } from "@/app/actions/twilio-sms";
import { NextRequest } from "next/server";
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { clientId, customerName, rating, feedback } = body;
	
		// lookup client
		const client = await getClientFromClientId(clientId);
		if (!client) return new Response("Failed to send review", { status: 500 });
	
		// Only alert on bad reviews
		if (rating <= 3) {
			await sendSMSMessage(client.twilioPhoneNumber!, client.phoneNumber!, `⚠️ New low review (${rating}⭐)
Customer: ${customerName}
Feedback: "${feedback}"`);
		}
	
		// TODO:
		// - store review
		// - show in dashboard
		// - DO NOT send public review link
	
		return new Response("OK", { status: 200 });
	} catch (e) {
		return new Response("Failed to send review", { status: 500 });
	}
}

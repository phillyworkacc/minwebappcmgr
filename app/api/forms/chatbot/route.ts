import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const getCORSHeaders = () => {
   const headers = new Headers();
   headers.set('Access-Control-Allow-Origin', '*');
   headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
   headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   return headers;
};

export async function OPTIONS() {
   return new NextResponse(null, {
      status: 204,
      headers: getCORSHeaders(),
   });
}

export async function POST (req: NextRequest) {
	const body = await req.json();
	console.log(body)
	const { phoneNumber, message } = body;

	const twilioPhoneNumber = "+447727653159";

	// TODO: lookup client by twilioPhoneNumber
	const client = {
		businessName: "Prime Driveways"
	};

  	// Send message into client SMS inbox
	// await twilioClient.messages.create({
	// 	from: twilioPhoneNumber,
	// 	to: twilioPhoneNumber,
	// 	body: `Website chat 💬
	// From: ${customerPhone}
	// Message: "${message}"`
	// });

	// Bot reply to customer
	await twilioClient.messages.create({
      from: twilioPhoneNumber,
      to: phoneNumber,
      body: `Thanks for messaging ${client.businessName}! We will text you shortly.`
	});

	// TODO:
	// - create/find conversation
	// - log messages
	// - mark source = chatbot

	return NextResponse.json("OK", { status: 200, headers: getCORSHeaders() });
}

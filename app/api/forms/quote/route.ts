import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export const runtime = "nodejs";

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

export async function POST(req: NextRequest) {
	const body = await req.json();

	console.log(body);

	const { clientId, name, phoneNumber, service, message } = body;

	// TODO: lookup client by clientId
	const client = {
		businessName: "Joe's Plumbing",
		twilioPhoneNumber: "+447727653159"
	};

	const smsBody = `New quote request 🔔
	Name: ${name}
	Phone: ${phoneNumber}
	Service: ${service}
	Message: "${message}"`;

	// await twilioClient.messages.create({
	//   from: client.twilioPhoneNumber,
	//   to: client.twilioPhoneNumber, // goes into SMS inbox
	//   body: smsBody
	// });

	// Optional auto-reply to customer
	await twilioClient.messages.create({
		from: client.twilioPhoneNumber,
		to: phoneNumber,
		body: `Thanks for contacting ${client.businessName}! We'll text you shortly.`
	});

	// TODO:
	// - upsert conversation
	// - insert lead
	// - insert message
	return NextResponse.json("OK", {
		status: 200, headers: getCORSHeaders()
	})
}

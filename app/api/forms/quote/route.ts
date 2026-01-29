import { getClientFromClientId } from "@/app/actions/clients";
import { createNewMessageUpsertConversation, notifyClient, sendSMSMessage } from "@/app/actions/twilio-sms";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

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
	const {
		minwebBusinessId: clientId, name, phoneNumber, message
	} = body;

	if (clientId == "" || name == "" || phoneNumber == "" || message == "") {
		return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() })
	}

	try {
		const client = await getClientFromClientId(clientId);
		if (!client) return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });

		const createConvo = await createNewMessageUpsertConversation(
			client.clientid!,
			`New Quote Request 🔔
Name: ${name}
Phone: ${phoneNumber}
Message: "${message}"`,
			{
				customerName: name,
				customerPhone: phoneNumber
			},
			"in"
		);
		if (!createConvo) return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });

		// Auto-reply to customer
		const sent = await sendSMSMessage(client.twilioPhoneNumber!, phoneNumber, `Hi ${name} thanks for reaching out to ${client.businessName}!
We've received your request and will be in touch shortly.`);
		if (!sent.success) return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });

		// Notify Client about new quote request
		const sentNotification = await notifyClient(client.clientid!, phoneNumber, "quote");
		if (!sentNotification) return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });
		
		return NextResponse.json(JSON.stringify({ success: true }), { status: 200, headers: getCORSHeaders() })
	} catch (e) {
		console.log(e);
		return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() })
	}
}

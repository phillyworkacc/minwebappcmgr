import { db } from "@/db";
import { clientsTable, conversationsTable, messagesTable } from "@/db/schemas";
import { uuid } from "@/utils/uuid";
import { eq } from "drizzle-orm";
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
	const {
		minwebBusinessId: clientId, name, phoneNumber, message
	} = body;

	if (clientId == "" || name == "" || phoneNumber == "" || message == "") {
		return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() })
	}

	try {
		const resClients = await db
			.select().from(clientsTable)
			.where(eq(clientsTable.clientid, clientId)).limit(1);
		const client = resClients[0];

		// Create Conversation (Lead) for Client
		const conversationId = uuid();
		const messageId = uuid().replaceAll('-','_');
		await db.insert(conversationsTable).values({
			conversationId, clientId,
			customerName: name,
			customerPhone: phoneNumber,
			lastMessageId: messageId,
		});
		
		// Add Message to Conversation
		const now = `${Date.now()}`;
		const messageBody = `New Quote Request 🔔
Name: ${name}
Phone: ${phoneNumber}
Message: "${message}"`;
		await db.insert(messagesTable).values({
			messageId, conversationId,
			body: messageBody, direction: 'in',
			date: now
		});

		// Auto-reply to customer
		await twilioClient.messages.create({
			from: client.twilioPhoneNumber!,
			to: phoneNumber,
			body: `Hi ${name} thanks for reaching out to ${client.businessName}!
We've received your request and will be in touch shortly.`
		});
		
		return NextResponse.json(JSON.stringify({ success: true }), { status: 200, headers: getCORSHeaders() })
	} catch (e) {
		console.log(e);
		return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() })
	}
}

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

export async function POST (req: NextRequest) {
	const body = await req.json();
	const {
		name, phoneNumber, message,
		minwebBusinessId: clientId
	} = body;
	
	
	if (clientId == "" || name == "" || phoneNumber == "" || message == "") {
		return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() })
	}

	try {
		const client = await getClientFromClientId(clientId);
		if (!client) return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });

		// if this Lead is in the Client's Conversations, create a message if not create a new conversation
		const createConvo = await createNewMessageUpsertConversation(
			client.clientid!,
			`Website Chat 💬
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

// 		const oldLead = await db.select().from(conversationsTable)
// 			.where(and(
// 				eq(conversationsTable.clientId, clientId),
// 				eq(conversationsTable.customerPhone, phoneNumber)
// 			)).limit(1);

// 		if (oldLead.length > 0) {
// 			// Add Message to Conversation
// 			const now = `${Date.now()}`;
// 			const messageId = uuid().replaceAll('-','_');
// 			const messageBody = `Website Chat 💬
// Name: ${name}
// Phone: ${phoneNumber}
// Message: "${message}"`;
// 			await db.insert(messagesTable).values({
// 				messageId, conversationId: oldLead[0].conversationId,
// 				body: messageBody, direction: 'in',
// 				date: now
// 			});
// 		} else {
// 			// Create Conversation (Lead) for Client
// 			const conversationId = uuid();
// 			const messageId = uuid().replaceAll('-','_');
// 			await db.insert(conversationsTable).values({
// 				conversationId, clientId,
// 				customerName: name,
// 				customerPhone: phoneNumber,
// 				lastMessageId: messageId,
// 			});

// 			// Add Message to Conversation
// 			const now = `${Date.now()}`;
// 			const messageBody = `Website Chat 💬
// Name: ${name}
// Phone: ${phoneNumber}
// Message: "${message}"`;
// 			await db.insert(messagesTable).values({
// 				messageId, conversationId,
// 				body: messageBody, direction: 'in',
// 				date: now
// 			});
// 		}
		
		// Auto-reply to customer
		const sent = await sendSMSMessage(client.twilioPhoneNumber!, phoneNumber, `Hi ${name}! Thanks for your message to ${client.businessName}!
We've got your question and will get back to you shortly.`);
		if (!sent.success) return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });

		// Notify Client about new quote request
		const sentNotification = await notifyClient(client.clientid!, phoneNumber, "message");
		if (!sentNotification) return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });

		return NextResponse.json(JSON.stringify({ success: true }), { status: 200, headers: getCORSHeaders() });
	} catch (e) {
		console.log(e);
		return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });
	}
}

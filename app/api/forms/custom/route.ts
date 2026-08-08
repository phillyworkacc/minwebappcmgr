import { getClientFromClientId } from "@/app/actions/clients";
import { sendCustomMailToClient } from "@/lib/sendMail";
import { NextRequest, NextResponse } from "next/server";

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
      subject, message, minwebBusinessId: clientId, to
   } = body;
   
   
   if (clientId == "" || subject == "" || message == "" || to == "") {
      return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() })
   }

   try {
      const client = await getClientFromClientId(clientId);
      console.log(client)
      if (!client) return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });

      // validations
      if (!client.email || !client.name || !client.customGmailAppPassword) {
         return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() })
      }

      // send email to client
      const sentMail = await sendCustomMailToClient(client.email, to, subject, message, client.customGmailAppPassword, client.name);

      return NextResponse.json(JSON.stringify({ success: sentMail }), { status: 200, headers: getCORSHeaders() });
   } catch (e) {
      console.log(e);
      return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });
   }
}
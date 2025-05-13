import { UserTrackerDB } from "@/db/UserTrackerDb";
import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
  'https://minweb.freevar.com',
  'https://detix-website.vercel.app',
];

export async function POST (req: NextRequest) {
   const origin = req.headers.get('origin');

   console.log(origin);

   const headers = new Headers();
   if (origin && allowedOrigins.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Vary', 'Origin');
   }

   const body = await req.json() as UserTrackingDataPartial;
   const authHeader = await req.headers.get("authorization")

   const { location, time, utmsource, device, os, page } = body;

   if (authHeader == undefined) {
      //! invalid request
      return NextResponse.json({ message: "Forbidden Request" }, { status: 500, headers })

   } else if (page == undefined || location == undefined || os == undefined || time == undefined || utmsource == undefined || device == undefined) {
      //! invalid request
      return NextResponse.json({ message: "Forbidden Request" }, { status: 500, headers })

   } else if (authHeader === "lSjFmFulZGPw+So4SVI5W/jcd3RMm6YH/c5nS2cGBWQ=") {
      //* valid request
      try {
         await UserTrackerDB.insert({ time, location, utmsource, device, os, page })
         return NextResponse.json({ message: "success" }, { status: 200, headers })
      } catch (er) {
         return NextResponse.json({}, { status: 500, headers })
      }
   }

}

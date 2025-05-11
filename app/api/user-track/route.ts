import { UserTrackerDB } from "@/db/UserTrackerDb";
import { NextRequest, NextResponse } from "next/server";


export async function POST (req: NextRequest) {
   const body = await req.json() as UserTrackingDataPartial;
   const authHeader = await req.headers.get("authorization")

   const { location, time, utmsource, device, os, page } = body;

   if (authHeader == undefined) {
      //! invalid request
      return NextResponse.json({ message: "Forbidden Request" }, { status: 500 })

   } else if (page == undefined || location == undefined || os == undefined || time == undefined || utmsource == undefined || device == undefined) {
      //! invalid request
      return NextResponse.json({ message: "Forbidden Request" }, { status: 500 })

   } else if (authHeader === "lSjFmFulZGPw+So4SVI5W/jcd3RMm6YH/c5nS2cGBWQ=") {
      //* valid request
      try {
         await UserTrackerDB.insert({ time, location, utmsource, device, os, page })
         return NextResponse.json({ message: "success" }, { status: 200 })
      } catch (er) {
         return NextResponse.json({}, { status: 500 })
      }
   }

}
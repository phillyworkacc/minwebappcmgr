import { UserTrackerDB } from "@/db/UserTrackerDb";
import { NextApiRequest, NextApiResponse } from "next";

const allowedOrigins = [
   'https://minweb.freevar.com',
   'https://detix-website.vercel.app',
];

export async function POST (req: NextApiRequest, res: NextApiResponse) {
   const origin = req.headers.origin;

   if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
   }

   const body = await req.body.json() as UserTrackingDataPartial;
   const authHeader = req.headers.authorization;

   const { location, time, utmsource, device, os, page } = body;

   if (authHeader == undefined) {
      //! invalid request
      res.status(500).json({ message: "Forbidden Request" })

   } else if (page == undefined || location == undefined || os == undefined || time == undefined || utmsource == undefined || device == undefined) {
      //! invalid request
      res.status(500).json({ message: "Forbidden Request" })

   } else if (authHeader === "lSjFmFulZGPw+So4SVI5W/jcd3RMm6YH/c5nS2cGBWQ=") {
      //* valid request
      try {
         await UserTrackerDB.insert({ time, location, utmsource, device, os, page })
         res.status(200).json({ message: "success" })
      } catch (er) {
         res.status(500).json({})
      }
   }
}

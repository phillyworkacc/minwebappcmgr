"use server"

import { UserTrackerDB } from "@/db/UserTrackerDb";

export async function getRecentTrackingData (): Promise<UserTrackingData[] | false> {
   try {
      const trackingData = await UserTrackerDB.getAllRecentTrackingData();
      return JSON.parse(JSON.stringify(trackingData));
   } catch (err) {
      return false;
   }
}

export async function getAllTimeTrackingData (): Promise<UserTrackingData[] | false> {
   try {
      const allTimeTrackingData = await UserTrackerDB.getAllTrackingData();
      return JSON.parse(JSON.stringify(allTimeTrackingData));
   } catch (err) {
      return false;
   }
}
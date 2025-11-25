import { NextResponse } from "next/server";
import { } from "@/lib/sendEmail";
import { db } from "@/db";
import { activitiesTable } from "@/db/schemas";
import { between, sql } from "drizzle-orm";

export async function GET() {
   const now = Date.now();
   const aDay = 1000 * 60 * 60 * 60 * 24;

   const tasks = await db
      .select()
      .from(activitiesTable)
      .where(
         between(
            sql<number>`CAST(${activitiesTable.dueDate} AS INTEGER)`,
            now - aDay,
            now + aDay
         )
      );

   
   // if (tasks.length > 0) {
   //    await sendEmail({
   //       subject: "Tasks Due Soon",
   //       text: tasks.map(t => `• ${t.title} – Due: ${t.dueDate}`).join("\n"),
   //    });
   // }

   return NextResponse.json({ ok: true });
}

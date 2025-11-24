import { boolean, pgTable, serial, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
   id: serial("id").primaryKey(),
   userid: text("userid"),
   name: text("name"),
   email: text("email"),
   password: text("password")
});

export const clientsTable = pgTable("clients", {
   id: serial("id").primaryKey(),
   userid: text("userid"),
   clientid: text("clientid"),
   name: text("name"),
   email: text("email"),
   description: text("description"),
   image: text("image"),
   notes: text("notes"),
   status: text("status"),
   websites: text("websites"),
   review: text("review"),
   latestupdate: text("latestupdate"),
   createdat: text("createdat"),
});

export const paymentsTable = pgTable("payments", {
   id: serial("id").primaryKey(),
   userid: text("userid"),
   clientid: text("clientid"),
   amount: text("amount"),
   text: text("text"),
   date: text("date"),
});

export const websitesTable = pgTable("websites", {
   id: serial("id").primaryKey(),
   userid: text("userid"),
   clientid: text("clientid"),
   websiteid: text("websiteid"),
   url: text("url"),
   date: text("date"),
});

export const activitiesTable = pgTable("activities", {
   id: serial("id").primaryKey(),
   activityId: text("activity_id"),
   userid: text("userid"),
   clientid: text("clientid"),
   title: text("title"),
   priority: text("priority"),
   markdownDescriptionText: text("markdown_desc_text"),
   completed: boolean("completed"),
   completeDate: text("complete_date"),
   dueDate: text("due_date"),
   date: text("date"),
});
import { pgTable, serial, text } from "drizzle-orm/pg-core";

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
   description: text("description"),
   image: text("image"),
   notes: text("notes"),
   status: text("status"),
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
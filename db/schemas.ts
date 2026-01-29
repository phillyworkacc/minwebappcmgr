import { bigint, boolean, integer, pgTable, serial, text, uniqueIndex } from "drizzle-orm/pg-core";

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
   websiteBuildType: text("website_build_type"),
   phoneNumber: text("phone_number"),
   twilioPhoneNumber: text("twilio_phone_number"),
   description: text("description"),
   businessName: text("business_name"),
   password: text("password"),
   image: text("image"),
   notes: text("notes"),
   status: text("status"),
   websites: text("websites"),
   review: text("review"),
   latestupdate: text("latestupdate"),
   createdat: text("createdat"),
});

export const automationsTable = pgTable("automations", {
   id: serial("id").primaryKey(),
   automationId: text("automation_id").unique(),
   clientId: text("client_id"),
   type: text("type"),
   message: text("message"),
   delay: integer("delay"),
   enabled: boolean("enabled")
})

export const automationRunsTable = pgTable("automation_runs", {
   id: serial("id").primaryKey(),
   automationId: text("automation_id"),
   clientId: text("client_id"),
   customerPhone: text("customer_phone"),
   status: boolean("status"),
   runAt: integer("run_at")
})

export const clientFormsTable = pgTable("client_forms", {
   id: serial("id").primaryKey(),
   clientFormId: text("client_form_id"),
   clientFormJson: text("client_form_json"),
   date: bigint("date", { mode: "number" }),
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
   notified: boolean("notified"),
   completed: boolean("completed"),
   completeDate: text("complete_date"),
   dueDate: bigint("due_date", { mode: "number" }),
   date: text("date"),
});

export const conversationsTable = pgTable("conversations", {
   id: serial("id").primaryKey(),
   conversationId: text("conversation_id").unique().notNull(),
   clientId: text("client_id"),
   customerName: text("customer_name"),
   customerPhone: text("customer_phone").notNull().unique(),
   lastMessageId: text("last_message_id")
})

export const messagesTable = pgTable("messages", {
   id: serial("id").primaryKey(),
   messageId: text("message_id"),
   conversationId: text("conversation_id"),
   body: text("body"),
   direction: text("direction"),
   date: text("date")
})

export const jobsTable = pgTable("jobs", {
   id: serial("id").primaryKey(),
   conversationId: text("conversation_id"),
   clientId: text("client_id"),
   serviceType: text("service_type"),
   completedAt: text("completed_at")
})
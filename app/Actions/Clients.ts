"use server"

import { ClientsDB } from "@/db/ClientDb";
import { getUserServer } from "./User";

export async function getAllUserClients () {
   try {
      const user = await getUserServer();
      if (!user) return false;
      const clients = await ClientsDB.getAllClients(user.userid);
      return JSON.parse(JSON.stringify(clients));
   } catch (err) {
      return false;
   }
}

export async function getInfoForReviewClient (clientId: string) {
   try {
      const client = await ClientsDB.getClientOnlyCID(clientId);
      return JSON.parse(JSON.stringify(client));
   } catch (err) {
      return false;
   }
}

export async function sendReviewForClient (clientId: string, review: string) {
   try {
      const client = await getInfoForReviewClient(clientId);
      const reviews = [review, ...client.review.split("@@!!@@")];
      const result = await ClientsDB.addClientReview(clientId, reviews.join("@@!!@@"), `${Date.now()}`);
      return result;
   } catch (err) {
      return false;
   }
}

export async function createUserClient (name: string, description: string, image: string) {
   try {
      const user = await getUserServer();
      if (!user) return false;

      const result = await ClientsDB.add({
         userid: user.userid,
         name, description, image,
         createdat: `${Date.now()}`,
         latestupdate: `${Date.now()}`
      });

      return result
   } catch (err) {
      return false;
   }
}

export async function getUserClientInfo (clientId: string) {
   try {
      const user = await getUserServer();
      if (!user) return false;
      const client = await ClientsDB.getClient(user.userid, clientId);
      return client ? JSON.parse(JSON.stringify(client)) : false;
   } catch (err) {
      return false;
   }
}

export async function updateClientInfoStatus (clientId: string, newStatus: ClientStatus) {
   try {
      const user = await getUserServer();
      if (!user) return false;
      const result = await ClientsDB.updateClientStatus(user.userid, clientId, newStatus, `${Date.now()}`);
      return result
   } catch (err) {
      return false;
   }
}

export async function updateClientInfoNotes (clientId: string, newNotes: string) {
   try {
      const user = await getUserServer();
      if (!user) return false;
      const result = await ClientsDB.updateClientNote(user.userid, clientId, newNotes, `${Date.now()}`);
      return result
   } catch (err) {
      return false;
   }
}
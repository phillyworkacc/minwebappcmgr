"use server"

import { UsersDB } from "@/db/UserDb";
import { hashPassword } from "@/utils/keygen";

export async function userEmailExists (email: string) {
   try {
      let user = await UsersDB.getUser(email);
      return user ? true : false;
   } catch (err) {
      return false;
   }
}

export async function userLogIn (email: string, password: string) {
   try {
      let user = await UsersDB.login(email, hashPassword(password));
      return user ? true : false;
   } catch (err) {
      return false;
   }
}

export async function createUser (name: string, email: string, password: string) {
   try {
      let user = await UsersDB.insert({
         name: name,
         email: email,
         password: hashPassword(password)
      });
      return user ? true : false;
   } catch (err) {
      return false;
   }
}
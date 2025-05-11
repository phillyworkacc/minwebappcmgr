"use server"

import { UsersDB } from "@/db/UserDb";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function getUserServer () {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user) return false;

      const user = await UsersDB.getUser(session.user.email!);
      return user ? user : false;
   } catch (err) {
      return false;
   }
}

export async function updateUserColorTheme (newCT: ColorTheme) {
   try {
      const user = await getUserServer();
      if (!user) return false;

      let result = await UsersDB.changeColorTheme(user.email, newCT);
      return result;
   } catch (err) {
      return false;
   }
}
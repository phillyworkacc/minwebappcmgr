import { redirect } from "next/navigation"
import {
  createErrorReturn,
  createSuccessReturn,
  DalError,
  DalReturn,
  ThrowableDalError,
} from "./types"
import { usersTable } from "@/db/schemas"
import { getCurrentUser } from "@/app/actions/user"
import { DrizzleQueryError } from "drizzle-orm"


export async function dalRequireAuthRedirect() {
   const user = await getCurrentUser();
   if (user == null) redirect("/login");
   return {
      userid: user.userid,
      name: user.name,
      email: user.email,
   };
}

export async function dalRequireAuth<T, E extends DalError>(
  operation: (user: typeof usersTable.$inferSelect) => Promise<DalReturn<T, E>>
) {
   const user = await getCurrentUser();
   if (user == null) return createErrorReturn({ type: "no-user" });
   return await operation(user);
}

export async function dalDbOperation<T>(operation: () => Promise<T>) {
   try {
      const data = await operation();
      return createSuccessReturn(data);
   } catch (e) {
      if (e instanceof ThrowableDalError) {
         return createErrorReturn(e.dalError)
      }
      if (e instanceof DrizzleQueryError) {
         return createErrorReturn({ type: "drizzle-error", error: e })
      }
      return createErrorReturn({ type: "unknown-error", error: e })
   }
}

export function dalFormatErrorMessage(error: DalError) {
   const type = error.type

   switch (error.type) {
      case "no-user":
         return "You must be logged in to perform this action."
      case "no-access":
         return "You do not have permission to perform this action."
      case "drizzle-error":
         return `A database error occurred`
      case "unknown-error":
         return `An unknown error occurred`
      default:
         throw new Error(`Unhandled error type: ${type as never}`)
   }
}
import { dalRequireAuthRedirect } from "@/dal/helpers"
import AddClientPage from "./AddClientPage";

export default async function AddClientTWS () {
   await dalRequireAuthRedirect();
   return <AddClientPage />;
}

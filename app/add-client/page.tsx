import { dalRequireAuthRedirect } from "@/dal/helpers"
import AddClientPage from "./AddClientPage";

export default async function AddClient () {
   await dalRequireAuthRedirect();
   return <AddClientPage />;
}

import { dalRequireAuthRedirect } from "@/dal/helpers"
import DashboardPage from "./Dashboard";

export default async function Dashboard () {
	await dalRequireAuthRedirect();
	return <DashboardPage />
}

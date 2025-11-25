import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import DashboardPage from "./Dashboard";
import { db } from "@/db";
import { activitiesTable, clientsTable, paymentsTable } from "@/db/schemas";
import { and, asc, desc, eq } from "drizzle-orm";
import LoadingPage from "./loading";

export default async function Dashboard () {
	await dalRequireAuthRedirect();

	const allDashboardData = await dalRequireAuth(user =>
		dalDbOperation(async () => {
			const allClients = await db.select()
				.from(clientsTable)
				.where(eq(clientsTable.userid, user.userid!));

			const allActivities = await db
				.select({
					id: activitiesTable.id,
					activityId: activitiesTable.activityId,
					userid: activitiesTable.userid,
					clientid: activitiesTable.clientid,
					title: activitiesTable.title,
					priority: activitiesTable.priority,
					markdownDescriptionText: activitiesTable.markdownDescriptionText,
					completed: activitiesTable.completed,
					completeDate: activitiesTable.completeDate,
					dueDate: activitiesTable.dueDate,
					date: activitiesTable.date,
					client: {
						id: clientsTable.id,
						userid: clientsTable.userid,
						clientid: clientsTable.clientid,
						name: clientsTable.name,
						description: clientsTable.description,
						image: clientsTable.image,
						notes: clientsTable.notes,
						status: clientsTable.status,
						websites: clientsTable.websites,
						review: clientsTable.review,
						latestupdate: clientsTable.latestupdate,
						createdat: clientsTable.createdat,
					}
				})
				.from(activitiesTable)
				.orderBy(asc(activitiesTable.dueDate))
				.innerJoin(clientsTable, eq(clientsTable.clientid, activitiesTable.clientid))
				.where(and(
					eq(activitiesTable.userid, user.userid!),
					eq(activitiesTable.completed, false)
				))
				.limit(4);

			const allPayments = await db.select()
            .from(paymentsTable)
            .where(eq(paymentsTable.userid, user.userid!))
            .orderBy(desc(paymentsTable.date));

			return {
				allClients, allActivities, allPayments
			}
		})
	)

	if (allDashboardData.success) {
		return <DashboardPage
			allClients={allDashboardData.data.allClients as any[]}
			allActivities={allDashboardData.data.allActivities as any[]}
			allPayments={allDashboardData.data.allPayments as any[]}
		/>
	} else {
		return <LoadingPage />
	}
}

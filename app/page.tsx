import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HomePage from "./HomePage";

export default async function Home() {
	const session = await getServerSession(authOptions);
	
	if (session?.user) {
		return <HomePage />
	} else {
		redirect('/login')
	}
}
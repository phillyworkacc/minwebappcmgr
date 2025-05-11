import { UsersDB } from "@/db/UserDb";
import { hashPassword } from "@/utils/keygen";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt"
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				name: {},
				email: {},
				password: {}
			},

			async authorize (credentials, req) {
            if (!credentials) return null;
				if (credentials?.email == "" || credentials?.password == "") return null;

				//* get user in from login database function
				const user = await UsersDB.login(credentials.email!, hashPassword(credentials.password!));
				if (user) {
					return {
						id: '',
						name: user.name,
						email: user.email
					}
				}

				//* create an account for the user if the user doesn't exist
				let result = await UsersDB.insert({
					name: credentials.name!,
					email: credentials.email!,
					password: hashPassword(credentials.password!)
				})
				
				return result ? {
					id: '',
					name: credentials.name,
					email: credentials.email
				} : null;
			},
		})
	],
	callbacks: {
		jwt: async ({ user, token, trigger, session }) => {
			if (trigger == "update") {
				return {
					...token,
					...session.user
				}
			}
			return { ...token, ...user }
		}
	}
}
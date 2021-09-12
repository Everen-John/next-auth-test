import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

export default async function auth(req, res) {
	return await NextAuth(req, res, {
		adapter: MongoDBAdapter({
			db: (await clientPromise).db(process.env.DATABASE_NAME),
		}),
		providers: [
			GoogleProvider({
				clientId: process.env.GOOGLE_ID,
				clientSecret: process.env.GOOGLE_SECRET,
			}),

			// ...add more providers here
		],
		callbacks: {
			async signIn({ user, account, profile, email, credentials }) {
				return true
			},
			async redirect({ url, baseUrl }) {
				return baseUrl
			},
			async session({ session, user, token }) {
				session.user.id = user.id
				return Promise.resolve(session)
			},
			async jwt({ token, user, account, profile, isNewUser }) {
				if (user) {
					token.uid = user._id
				}
				return Promise.resolve(token)
			},
		},
		jwt: {
			signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
		},
	})
}

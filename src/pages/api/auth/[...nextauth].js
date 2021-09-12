import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

export default async function auth(req, res) {
	return await NextAuth(req, res, {
		adapter: MongoDBAdapter({
			db: (await clientPromise).db("eren-db"),
		}),
		providers: [
			GithubProvider({
				clientId: process.env.GITHUB_ID,
				clientSecret: process.env.GITHUB_SECRET,
			}),
			GoogleProvider({
				clientId: process.env.GOOGLE_ID,
				clientSecret: process.env.GOOGLE_SECRET,
			}),

			// ...add more providers here
		],
	})
}

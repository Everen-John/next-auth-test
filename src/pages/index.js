import Head from "next/head"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"

import SignInStatus from "../components/Users/signInStatus"

export default function Component({ client }) {
	const { data: session } = useSession()
	return (
		<>
			<SignInStatus session={session} />
		</>
	)
}

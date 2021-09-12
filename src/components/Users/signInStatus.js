import Head from "next/head"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component({ session }) {
	return (
		<>
			{session ? (
				<h3>
					Signed in as {session.user.email} <br />
					{session.user.emailVerified ? null : <h5>Verify your email!</h5>}
					<button onClick={() => signOut()}>Sign out</button>
				</h3>
			) : (
				<h3>
					Not signed in <br />
					<button onClick={() => signIn()}>Sign in</button>
				</h3>
			)}
		</>
	)
}

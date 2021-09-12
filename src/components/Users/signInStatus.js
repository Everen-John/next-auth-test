import Head from "next/head"
import Image from "next/image"
import { signIn, signOut } from "next-auth/react"
import { ObjectId } from "mongodb/lib/bson"

export default function Component({ session }) {
	console.log(session)
	return (
		<>
			{session ? (
				<div>
					Signed in as {session.user.name} <br />
					{session.user.emailVerified ? null : <h5>Verify your email!</h5>}
					<button onClick={() => signOut()}>Sign out</button>
					<h4>{session.user._id}</h4>
				</div>
			) : (
				<h3>
					Not signed in <br />
					<button onClick={() => signIn()}>Sign in</button>
				</h3>
			)}
		</>
	)
}

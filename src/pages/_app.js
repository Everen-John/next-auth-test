// pages/_app.js
import { SessionProvider } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"
import "../styles/globals.css"
import "tailwindcss/tailwind.css"

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	// if (process.env.APP_MODE === "production") {
	// 	console.log = function () {
	// 		return false
	// 	}
	// }
	return (
		<SessionProvider session={session}>
			<Component {...pageProps} />
		</SessionProvider>
	)
}

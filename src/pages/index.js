import Head from "next/head"
import Image from "next/image"
import { useSession } from "next-auth/react"

import Layout from "../components/master/layout"

import CalendarBlock from "../components/Calendar/calendarBlock"

export default function HomePage({ client }) {
	const { data: session } = useSession()

	return (
		<Layout session={session}>
			<CalendarBlock session={session} />
		</Layout>
	)
}

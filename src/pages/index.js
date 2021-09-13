import Head from "next/head"
import Image from "next/image"
import { useSession } from "next-auth/react"

import Layout from "../components/master/layout"

import CalendarBlock from "../components/Calendar/calendarBlock"

export default function HomePage({ client }) {
	const { data: session } = useSession()

	return (
		<Layout session={session}>
			<h1 className='text-2xl'>Content Here</h1>
			<CalendarBlock />
		</Layout>
	)
}

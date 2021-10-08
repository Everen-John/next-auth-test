import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

import Layout from "../../components/master/layout"

export default function joinedClassView() {
	const { data: session } = useSession()
	const router = useRouter()
	const { classid } = router.query

	return (
		<Layout session={session}>
			<p>ClassId: {classid}</p>
		</Layout>
	)
}

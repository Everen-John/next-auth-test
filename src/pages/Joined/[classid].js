import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

import Layout from "../../components/master/layout"

export default function joinedClassView() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid } = router.query

	const getClassJoinedData = async () => {
		if (status === "authenticated") {
			let res = await fetch("../api/classJoinedData/getClassJoinedData", {
				method: "POST", // *GET, POST, PUT, DELETE, etc.
				mode: "cors", // no-cors, *cors, same-origin
				cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
				credentials: "same-origin", // include, *same-origin, omit
				headers: {
					"Content-Type": "application/json",
				},
				redirect: "follow", // manual, *follow, error
				referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
				body: JSON.stringify({
					user: session.user.id,
					classid: classid,
				}), // body data type must match "Content-Type" header
			}).then((res) => res.json())
			console.log(res)
		}
	}
	useEffect(async () => {
		getClassJoinedData()
	}, [status])

	return (
		<Layout session={session}>
			<p>ClassId: {classid}</p>
		</Layout>
	)
}

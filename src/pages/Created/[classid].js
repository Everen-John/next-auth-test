import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Image from "next/image"

import Layout from "../../components/master/layout"
import ClassJoinedContentBlock from "../../components/intakeid/classJoinedContentBlock"

export default function classid() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [intakesInClass, setIntakesInClass] = useState()
	const [loading, setLoading] = useState(true)
	const { classid } = router.query

	const getIntakeJoinedData = async () => {
		setLoading(true)
		if (status === "authenticated") {
			let res = await fetch(
				"../api/classCreatedData/getIntakesOfClassCreated",
				{
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
				}
			).then((res) => res.json())
			setIntakesInClass(res)
			setLoading(false)
		} else {
			console.log("Not authenticated!")
		}
	}
	useEffect(async () => {
		getIntakeJoinedData()
	}, [status === "authenticated"])

	useEffect(async () => {
		console.log(intakesInClass)
	}, [intakesInClass])

	// useEffect(
	// 	(async) => {
	// 		console.log(intakeJoined)
	// 		console.log(intakeJoined ? "Contains Data" : "Does not contain Data")
	// 	},
	// 	[intakeJoined]
	// )

	return (
		<Layout session={session}>
			<div className='bg-green-500'>
				<p>ClassId: {classid}</p>

				{/* {loading ? (
					<div className='bg-indigo-400 flex justify-center p-14'>
						<Image src='/Loaders/oval.svg' width={150} height={150} />
					</div>
				) : (
					<ClassJoinedContentBlock intakeJoined={intakeJoined} />
				)} */}
			</div>
		</Layout>
	)
}

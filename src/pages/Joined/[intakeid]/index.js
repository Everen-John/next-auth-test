import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Image from "next/image"

import Layout from "../../../components/master/layout"
import ClassJoinedContentBlock from "../../../components/intakeid/classJoinedContentBlock"

export default function Intakeid() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [intakeJoined, setIntakeJoined] = useState()
	const [loading, setLoading] = useState(true)
	const { intakeid } = router.query

	const getIntakeJoinedData = async () => {
		setLoading(true)
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
					intakeid: intakeid,
				}), // body data type must match "Content-Type" header
			}).then((res) => res.json())
			setIntakeJoined(res)
			console.log(res)
			localStorage.setItem(`${res._id._id}name`, res._id.intake_name)
			setLoading(false)
		}
	}
	useEffect(async () => {
		getIntakeJoinedData()
	}, [status])

	useEffect(
		(async) => {
			console.log(intakeJoined)
			console.log(intakeJoined ? "Contains Data" : "Does not contain Data")
		},
		[intakeJoined]
	)

	return (
		<Layout session={session}>
			<div className=''>
				{loading ? (
					<div className='flex justify-center m-10'>
						<Image
							src='/Loaders/tail-spin.svg'
							width={100}
							height={100}
							alt='spinner'
						/>
					</div>
				) : (
					<ClassJoinedContentBlock intakeJoined={intakeJoined} />
				)}
			</div>
		</Layout>
	)
}

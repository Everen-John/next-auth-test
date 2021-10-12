import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Image from "next/image"

import Layout from "../../components/master/layout"

export default function joinedClassView() {
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
			<div className='bg-green-500'>
				<p>ClassId: {intakeid}</p>
				{loading ? (
					<div className='bg-indigo-400 flex justify-center p-14'>
						<Image src='/Loaders/oval.svg' width={150} height={150} />
					</div>
				) : (
					<div>
						{intakeJoined.yearlyItems.map((yearlyItem, key) => {
							return (
								<div>
									<div className='flex flex-row' key={key}>
										<div className=' m-auto border-b-4 border-gray-700 border-dotted flex-grow-0 w-4'></div>
										<div className='text-gray-700 text-xl'>[</div>
										<div className=' text-xl text-gray-700 '>
											{yearlyItem.year}
										</div>
										<div className='text-gray-700 text-xl'>]</div>
										<div className=' m-auto border-b-4 border-gray-700 border-dotted flex-grow'></div>
									</div>
									{yearlyItem.yearedData.map((yearedData, key) => {
										return (
											<div key={key}>
												<div>week Number: {yearedData.weekNumber}</div>
												{yearedData.weekItems.map((weekItem, key) => {
													return <h2>{weekItem.type}</h2>
												})}
											</div>
										)
									})}
								</div>
							)
						})}
					</div>
				)}
			</div>
		</Layout>
	)
}

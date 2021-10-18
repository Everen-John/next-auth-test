import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import IntakeAccordian from "../../../components/classid/intakeAccordian"
import Image from "next/image"
import { XyzTransitionGroup } from "@animxyz/react"

import Layout from "../../../components/master/layout"
import ClassCreatedContentBlock from "../../../components/classid/classCreatedContentBlock"
import {
	BookOpenIcon,
	AcademicCapIcon,
	CloudUploadIcon,
	AnnotationIcon,
	ExclamationCircleIcon,
} from "@heroicons/react/outline"
import { PlusIcon } from "@heroicons/react/solid"

import FABButton from "../../../components/classid/classCreatedFABButton"

export default function classid() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [intakesInClass, setIntakesInClass] = useState()
	const [intakeId, setIntakeId] = useState()
	const [intakeData, setIntakeData] = useState()
	const [intakeLoading, setIntakeLoading] = useState(true)
	const [loading, setLoading] = useState(true)

	const { classid } = router.query

	const getIntakeList = async () => {
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
			console.log("intakeList", res)
			setIntakesInClass(res)
			setLoading(false)
		} else {
			console.log("Not authenticated!")
		}
	}
	const getIntakeCreatedData = async () => {
		setIntakeLoading(true)
		if (status === "authenticated" && intakeId) {
			let res = await fetch("../api/classCreatedData/getIntakeCreatedData", {
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
					intakeid: intakeId,
				}), // body data type must match "Content-Type" header
			}).then((res) => res.json())
			setIntakeData(res)
			setIntakeLoading(false)
		} else {
			console.log("Intakeid not ready yet, or not authenticated!")
			console.log("status", status)
			console.log("intakeId", intakeId)
		}
	}
	const loadIntakeData = (intakeid) => {
		setIntakeId(intakeid)
	}

	useEffect(async () => {
		if (status === "authenticated") {
			getIntakeList()
		} else {
			console.log("Awaiting authentication!")
		}
	}, [status])

	useEffect(async () => {
		if (!intakeId && classid) {
			console.log("running if statement")
			setIntakeId(
				JSON.parse(
					localStorage.getItem(`classId${classid}lastPickedAccordianMenu`)
				).intake_oID
			)
		} else {
			console.log("classid not ready yet, or intakeid is already set")
		}
	}, [intakeId, classid])

	useEffect(() => {
		if (intakeId) {
			getIntakeCreatedData()
		}
	}, [intakeId, status === "authenticated"])

	return (
		<Layout session={session}>
			<div className='bg-green-500'>
				<p>ClassId: {classid}</p>
			</div>
			<p>IntakeId: {intakeId}</p>

			{loading ? null : (
				<div>
					<div className='max-w-full text-3xl m-2 rounded-md pl-2 bg-gray-800 text-green-400 font-bold shadow-lg text-center'>
						<BookOpenIcon className='max-h-full inline-block w-10 pb-1' />{" "}
						{intakesInClass[0].class_name}
					</div>
					<IntakeAccordian
						title={"Test"}
						classid={classid}
						content={intakesInClass}
						loadIntakeData={loadIntakeData}
					/>
					<FABButton
						classid={intakesInClass[0].class_oID}
						intakeid={intakeId}
					/>
				</div>
			)}

			{intakeLoading ? (
				<div className='flex justify-center m-10'>
					<Image src='/Loaders/tail-spin.svg' width={100} height={100} />
				</div>
			) : (
				<div>
					<ClassCreatedContentBlock intakeCreated={intakeData} />
				</div>
			)}
		</Layout>
	)
}

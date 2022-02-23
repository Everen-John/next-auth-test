import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import IntakeAccordian from "../../../components/classid/intakeAccordian"
import Image from "next/image"
import { XyzTransitionGroup } from "@animxyz/react"

import Layout from "../../../components/master/layout"
import ClassCreatedContentBlock from "../../../components/classid/classCreatedContentBlock"
import { BookOpenIcon, DuplicateIcon } from "@heroicons/react/outline"
import { PlusIcon } from "@heroicons/react/solid"

import FABButton from "../../../components/classid/classCreatedFABButton"

export default function Index() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [intakesInClass, setIntakesInClass] = useState()
	const [intakeId, setIntakeId] = useState()
	const [intakeData, setIntakeData] = useState()
	const [intakeLoading, setIntakeLoading] = useState(true)
	const [loading, setLoading] = useState(true)
	const [intakeCopied, setIntakeCopied] = useState(false)
	const intakeidRef = useRef()

	const { classid, get_intake_id } = router.query

	const getIntakeList = async () => {
		// setLoading(true)
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
			if (get_intake_id) {
				setIntakeId(get_intake_id)
				localStorage.setItem(
					`classId${classid}lastPickedAccordianMenu`,
					JSON.stringify({
						intake_oID: get_intake_id,
						// intake_name: res[0].intake_name,
						intake_name:
							res[res.findIndex((i) => i.intake_oID === get_intake_id)]
								.intake_name,
					})
				)
			} else if (
				!intakeId &&
				!get_intake_id &&
				!localStorage.getItem(`classId${classid}lastPickedAccordianMenu`)
			) {
				setIntakeId(res[0].intake_oID)
				localStorage.setItem(
					`classId${classid}lastPickedAccordianMenu`,
					JSON.stringify({
						intake_oID: res[0].intake_oID,
						intake_name: res[0].intake_name,
					})
				)
				localStorage.setItem(
					`intake_${res[0].intake_oID}_name`,
					res[0].intake_name
				)
			}

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
			})
				.then((res) => {
					return res.json()
				})
				.then((res) => {
					console.log(res)
					localStorage.setItem(
						`intake_${res._id._id}_name`,
						res._id.intake_name
					)
					console.log(`intake_${res._id._id}_name`, res._id.intake_name)
					return res
				})
				.catch((err) => {
					setIntakeData(res)
					setIntakeLoading(false)
				})

			setIntakeData(res)
			setIntakeLoading(false)
			console.log("res", res)
		} else {
			console.log("Intakeid not ready yet, or not authenticated!")
			console.log("status", status)
			console.log("intakeId", intakeId)
		}
	}
	const loadIntakeData = (intakeid) => {
		setIntakeId(intakeid)
	}

	const copyIntakeid = () => {
		let intakeid = intakeidRef.current.innerText
		console.log(intakeid)
		navigator.clipboard.writeText(intakeid)
		setIntakeCopied(true)
	}

	useEffect(() => {
		async function fetchIntakeList() {
			if (Object.keys(router.query).length && status === "authenticated") {
				getIntakeList()
			} else {
				console.log("Awaiting authentication!")
			}
		}
		fetchIntakeList()
	}, [status, router.query])

	useEffect(async () => {
		if (!intakeId && classid) {
			console.log("intakeid", intakeId)
			console.log("classid", classid)
			console.log(
				"localstoragecheck",
				localStorage.getItem(`classId${classid}lastPickedAccordianMenu`)
			)
			if (localStorage.getItem(`classId${classid}lastPickedAccordianMenu`)) {
				try {
					setIntakeId(
						JSON.parse(
							localStorage.getItem(`classId${classid}lastPickedAccordianMenu`)
						).intake_oID
					)
				} catch (e) {
					console.log(e)
				}
			} else {
				console.log("Doing nothing!")
			}
		} else {
			console.log("classid not ready yet, or intakeid is already set")
			console.log("intakeid", intakeId)
			console.log("classid", classid)
		}
	}, [intakeId, classid])

	useEffect(() => {
		if (intakeId) {
			getIntakeCreatedData()
		}
	}, [intakeId, status === "authenticated"])

	useEffect(() => {
		if (intakeCopied === true) {
			setTimeout(() => {
				setIntakeCopied(false)
			}, 2000)
		}
	}, [intakeCopied])
	return (
		<Layout session={session}>
			{loading ? null : (
				<div>
					<div className='max-w-full text-3xl m-2 rounded-md pl-2 bg-gray-800 text-green-400 font-bold shadow-lg text-center'>
						<BookOpenIcon className='max-h-full inline-block w-10 pb-1' />{" "}
						{intakesInClass[0].class_name}
					</div>
					<IntakeAccordian
						classid={classid}
						content={intakesInClass}
						loadIntakeData={loadIntakeData}
						class_name={intakesInClass[0].class_name}
					/>
					<div
						className='flex justify-left text-gray-600 bg-gray-800 m-2 rounded-md px-10 hover:bg-gray-300 hover:text-gray-800 hover:cursor-pointer'
						onClick={copyIntakeid}
					>
						<div>
							<DuplicateIcon className='h-6 w-6 inline mr-2' />
						</div>{" "}
						<div
							className='inline self-center select-none h-4'
							ref={intakeidRef}
						>
							<XyzTransitionGroup
								className='item-group'
								xyz='fade right-100% back-1'
							>
								{intakeCopied && (
									<div className='inline-block absolute'> Intake Copied!</div>
								)}
								{!intakeCopied && (
									<div className='inline-block absolute'>{intakeId}</div>
								)}
							</XyzTransitionGroup>
						</div>
					</div>
					<FABButton
						classid={intakesInClass[0].class_oID}
						intakeid={intakeId}
					/>
				</div>
			)}

			{intakeLoading ? (
				<div className='flex justify-center m-10'>
					<Image
						src='/Loaders/tail-spin.svg'
						width={100}
						height={100}
						alt='spinner'
					/>
				</div>
			) : intakeData ? (
				<div>
					<div>
						<ClassCreatedContentBlock
							intakeCreated={intakeData}
							classid={classid}
							intakeid={intakeId}
						/>
					</div>
				</div>
			) : (
				<h1 className='text-2xs text-white text-center '>
					Click the bottom right {"  "}
					<PlusIcon className='w-7 h-7 p-2 inline-block bg-green-600 text-green-100 rounded-full hover:bg-green-700 ' />{" "}
					to start!
				</h1>
			)}
		</Layout>
	)
}

import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import Layout from "../../../../components/master/layout"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { ExclamationCircleIcon, InboxInIcon } from "@heroicons/react/outline"

import DatePicker from "react-datepicker"
import { data } from "autoprefixer"
import * as yup from "yup"
import { create } from "yup/lib/Reference"
// import RadioQuizType from "../../../../components/classid/createQuiz/RadioQuizType"

let submission_Schema = yup.object().shape({
	submission_Title: yup.string().max(40, "max title reached!").required(),
	submission_description: yup.string().required(),
	publish_time: yup.date().required(),
	deadline: yup.date().required(),
	in_intake_oID: yup.string().required(),
	fileFormats: yup.array().min(1).required(),
	maxFileSize: yup.number().required(),
})

let formatTypes = [".jpg", ".jpeg", ".png", ".docx", ".doc", ".pdf"]

export default function CreateQuiz() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid, intake_name } = router.query
	const [submissionData, setSubmissionData] = useState({
		submission_Title: "",
		submission_description: "",
		publish_time: new Date(),
		in_intake_oID: "",
		deadline: new Date(),
		fileFormats: [],
		maxFileSize: 1048576 * 24,
	})
	const [submitButtonActive, setSubmitButtonActive] = useState(false)

	const createSubmission = async () => {
		console.log("Ran createSubmission")
		try {
			let res = await fetch("/api/classCreatedData/createSubmission", {
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
					userid: session.user.id,
					intakeid: intakeid,
					submissionData: submissionData,
				}), // body data type must match "Content-Type" header
			})
				.then((res) => res.json())
				.catch((e) => console.log(e))
			return res
		} catch (e) {
			console.log(e)
		}
	}
	const handleSubmit = async () => {
		return new Promise(async (resolve, reject) => {
			let submissionCreation = await createSubmission()
			if (submissionCreation.msg === "ok") {
				resolve(submissionCreation)
			} else {
				reject()
			}
		})
			.then((res) => {
				console.log(res)
				window.alert("Submission successfully created!")
				router.push(`/Created/${classid}`)
			})
			.catch((e) => window.alert("Failed to create submission."))
	}

	const loadPage = async () => {
		setSubmissionData({ ...submissionData, in_intake_oID: intakeid })
	}

	useEffect(async () => {
		if (Object.keys(router.query).length && status === "authenticated") {
			console.log("router Query Activated")
			await loadPage()
		}
	}, [router.query, status])

	useEffect(async () => {
		console.log(submissionData)
		await submission_Schema.isValid(submissionData).then((valid) => {
			console.log("valid", valid)
			if (valid) {
				setSubmitButtonActive(true)
				console.log("Upload Button should be activated")
			} else {
				setSubmitButtonActive(false)
				console.log("Upload Button should not be activated")
			}
		})
	}, [submissionData])

	return (
		<Layout session={session}>
			<div>
				<div className='m-2 text-xs text-white'>
					<Link href='/'>
						<a className='text-green-400 mx-2'>Home</a>
					</Link>
					{" > "}
					<Link href={`/Created/${classid}`}>
						<a className='text-green-400 mx-2 '>{intake_name}</a>
					</Link>
				</div>
				<div className='bg-green-700 m-2 px-3 py-3 rounded-md flex'>
					<InboxInIcon className='w-10 h-auto text-white inline-block mr-2 ' />
					<div className='inline-block text-white text-xl self-center '>
						Create Submission
					</div>
				</div>
				<div className='bg-green-700 m-2 px-3 py-3 rounded-md'>
					<div className='mb-3 text-xs  '>
						<div className='text-white'>Announcement Title</div>
						<input
							className='h-10 w-full border rounded-lg p-1'
							type='text'
							required={true}
							placeholder='Give the Announcement a Title...'
							name='title'
							maxLength={40}
							value={submissionData.announcement_Title}
							onChange={(e) => {
								setSubmissionData({
									...submissionData,
									submission_Title: e.target.value,
								})
							}}
						/>
					</div>
					<div className='mb-3 text-xs  '>
						<div className='text-white'>Submission Description</div>
						<textarea
							className='w-full text-xs border rounded-lg p-1'
							type='textarea'
							required={true}
							placeholder='Give the Announcement a description...'
							name='description'
							maxLength={200}
							value={submissionData.announcement_description}
							onChange={(e) => {
								setSubmissionData({
									...submissionData,
									submission_description: e.target.value,
								})
							}}
							rows={3}
						/>
					</div>

					<div className=' mb-5 w-full text-xs z-9999'>
						<div className='text-white'>Submission beginning</div>
						<DatePicker
							className='border rounded-md p-1 pl-2 w-full'
							name='publish_time'
							selected={submissionData.publish_time}
							showTimeSelect
							timeFormat='HH:mm'
							timeIntervals={15}
							dateFormat='dd/MM/yyyy h:mm aa'
							onChange={(date) =>
								setSubmissionData({
									...submissionData,
									publish_time: new Date(date),
								})
							}
						/>
					</div>
					<div className=' mb-5 w-full text-xs z-9999'>
						<div className='text-white'>Submission ending</div>
						<DatePicker
							className='border rounded-md p-1 pl-2 w-full'
							name='publish_time'
							selected={submissionData.deadline}
							showTimeSelect
							timeFormat='HH:mm'
							timeIntervals={15}
							dateFormat='dd/MM/yyyy h:mm aa'
							onChange={(date) =>
								setSubmissionData({
									...submissionData,
									deadline: new Date(date),
								})
							}
						/>
					</div>
					<div className=' mb-5 w-full text-xs z-9999'>
						<div className='text-white'>File formats</div>
						<div className=' grid grid-cols-4 gap-1'>
							{formatTypes.map((item, key) => {
								return (
									<div
										className='bg-gray-100 rounded-sm border border-gray-300 flex flex-row'
										onClick={(e) => {
											console.log("e", e)
											console.log("item", item)
											console.log("key", key)
											let fileFormatsTemp = submissionData.fileFormats
											let formatIndex = submissionData.fileFormats.indexOf(item)
											if (formatIndex === -1) {
												fileFormatsTemp.push(item)
											} else {
												fileFormatsTemp.splice(formatIndex, 1)
											}
											setSubmissionData({
												...submissionData,
												fileFormats: fileFormatsTemp,
											})
										}}
										key={key}
									>
										<input
											type='checkbox'
											name='fileFormats'
											value={item}
											className='flex-shrink-0 self-center mx-2 '
											checked={submissionData.fileFormats.includes(item)}
											readOnly={true}
										></input>
										<div className='flex-grow text-sm'>{item}</div>
									</div>
								)
							})}
						</div>
					</div>
					<div className=' mb-5 h-10 w-full text-xs z-9999'>
						<div className='text-white'>Max File Size</div>
						<input
							type='text'
							value={submissionData.maxFileSize}
							disabled
							className='w-full border rounded-lg p-1'
						/>
					</div>
				</div>

				<div className='flex justify-end m-2'>
					<button
						onClick={handleSubmit}
						disabled={submitButtonActive ? false : true}
						className={`${
							submitButtonActive
								? "bg-green-600 text-white font-bold transition-opacity shadow-lg border border-green-900 "
								: "bg-green-900 bg-opacity-50 text-opacity-50 text-gray-50 scale-50"
						} text-base rounded-lg px-6 py-2`}
					>
						Submit{" "}
					</button>
				</div>
			</div>
		</Layout>
	)
}

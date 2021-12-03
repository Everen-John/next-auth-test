import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import Layout from "../../../../../../components/master/layout"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Image from "next/image"
import { PlusCircleIcon, PlusIcon, InboxInIcon } from "@heroicons/react/outline"
import { Icon } from "@mdi/react"
import { mdiFile, mdiDelete } from "@mdi/js"
import DatePicker from "react-datepicker"
import { data } from "autoprefixer"
import * as yup from "yup"
// import RadioQuizType from "../../../../components/classid/createQuiz/RadioQuizType"
let submission_Schema = yup.object().shape({
	submission_Title: yup.string().max(40, "max title reached!").required(),
	submission_description: yup.string().required(),
	publish_time: yup.date().required(),
	deadline: yup.date().required(),
	in_intake_oID: yup.string().required(),
	fileFormats: yup.array().min(1).required(),
	maxFileSize: yup.number().required(),
	namingConvention: yup.array().min(3).required(),
})

let formatTypes = [".jpg", ".jpeg", ".png", ".docx", ".doc", ".pdf"]

export default function SubmissionDashboard() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid, intake_name, submissionid } = router.query
	const [submissionData, setSubmissionData] = useState()
	const [loading, setLoading] = useState(true)
	const [updateButtonActive, setUpdateButtonActive] = useState(false)

	const getSubmissionData = async () => {
		console.log("Ran getSubmissionData")
		try {
			let res = await fetch("/api/classCreatedData/getSubmissionData", {
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
					submissionid: submissionid,
				}), // body data type must match "Content-Type" header
			})
				.then((res) => res.json())
				.catch((e) => console.log(e))
			return res
		} catch (e) {
			console.log(e)
		}
	}

	const namingConventionConcatenator = () => {
		let namingConventionTemp = JSON.parse(
			JSON.stringify(submissionData.namingConvention)
		)
		for (let i = 0; i <= namingConventionTemp.length; i++) {
			switch (namingConventionTemp[i]) {
				case "__NAME__":
					namingConventionTemp[i] = session.user.name
					break
				case "__DATE__":
					namingConventionTemp[i] =
						new Date().toLocaleDateString("en-GB") +
						" " +
						new Date().toLocaleTimeString("en-GB")
					break

				default:
					break
			}
		}
		console.log("name", namingConventionTemp.join(" "))
		return namingConventionTemp.join(" ")
	}

	const namingConventionChangeHandler = (e, key) => {
		if (e.target.value.match(/^[\w&.\-]+$/) != null || e.target.value === "") {
			let namingConventionTemp = JSON.parse(
				JSON.stringify(submissionData.namingConvention)
			)
			namingConventionTemp[key] = e.target.value
			setSubmissionData({
				...submissionData,
				namingConvention: namingConventionTemp,
			})
		}
	}

	const loadPage = async () => {
		return new Promise(async (resolve, reject) => {
			let submissionData = await getSubmissionData()
			resolve(submissionData)
		})
			.then((submissionData) => {
				setSubmissionData({
					...submissionData,
					publish_time: new Date(submissionData.publish_time),
					deadline: new Date(submissionData.deadline),
				})
				return
			})
			.then(() => {
				setLoading(false)
			})
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
				setUpdateButtonActive(true)
				console.log("Upload Button should be activated")
			} else {
				setUpdateButtonActive(false)
				console.log("Upload Button should not be activated")
			}
		})
	}, [submissionData])

	return (
		<Layout session={session}>
			<div className='m-2 text-xs text-white'>
				<Link href='/'>
					<a className='text-green-400 mx-2'>Home</a>
				</Link>
				{" > "}
				<Link href={`/Created/${classid}`}>
					<a className='text-green-400 mx-2 '>{intake_name}</a>
				</Link>
			</div>
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
				<div>
					<div className='bg-green-700 m-2 px-3 py-3 rounded-md flex'>
						<InboxInIcon className='w-10 h-auto text-white inline-block mr-2 ' />
						<div className='inline-block text-white text-xl self-center font-black'>
							Edit Submission
						</div>
					</div>
					<div className='bg-green-700 m-2 px-3 py-3 rounded-md'>
						<div className='text-white text-xl mb-5 font-semibold'>
							Submissions{" "}
						</div>
						<div className='bg-gray-100 p-2'>
							{submissionData.submitters.length > 0 ? (
								submissionData.submitters.map((item, key) => {
									return (
										<div className='flex justify-center flex-row'>
											<a
												href={item.submittedLocation}
												className='inline-block'
												key={key}
												download={true}
											>
												<div
													key={key}
													className='bg-white mx-1 my-1 p-2 border border-solid border-gray-300 rounded-md'
												>
													<Icon
														path={mdiFile}
														title='User Profile'
														size={1}
														className='inline-block text-green-500'
													/>

													{decodeURIComponent(
														item.submittedLocation.replace(/(.*)\//g, " ")
													)}
												</div>
											</a>
											<div className='inline-block self-center'>
												<button
												// onClick={() => {
												// 	deleteFileHandler(item)
												// }}
												>
													<Icon
														path={mdiDelete}
														title='User Profile'
														size={1}
														className='inline-block text-red-500'
													/>
												</button>
											</div>
										</div>
									)
								})
							) : (
								<div className='flex justify-center text-gray-500'>
									You have not submitted any files yet!
								</div>
							)}
						</div>
					</div>
					<div className='bg-green-700 m-2 px-3 py-3 rounded-md'>
						<div className='text-white text-xl mb-5 font-semibold'>
							Submission Info
						</div>
						<div className='mb-3 text-xs  '>
							<div className='text-white'>Submission Title</div>
							<input
								className='h-10 w-full border rounded-lg p-1'
								type='text'
								required={true}
								placeholder='Give the Announcement a Title...'
								name='title'
								maxLength={40}
								value={submissionData.submission_Title}
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
								value={submissionData.submission_description}
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
								className=' rounded-md p-1 pl-2 w-full'
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
								disabled={true}
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
												let formatIndex =
													submissionData.fileFormats.indexOf(item)
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
						<div className='mb-3 text-xs  '>
							<div className='text-white'>Naming convention</div>
							{submissionData.namingConvention.map((item, key) => {
								return (
									<input
										className='rounded-sm mb-1 px-3'
										type='text'
										value={item}
										key={key}
										onChange={(e) => {
											namingConventionChangeHandler(e, key)
										}}
									/>
								)
							})}
							{status === "authenticated" ? (
								<div className='mt-2 text-white'>
									Name Preview: <div>{namingConventionConcatenator()}</div>
								</div>
							) : null}
						</div>
						<div className='mb-3 text-xs  '>
							<div className='text-white'>Maximum number of files (WIP)</div>
							<select
								className={`appearance-none text-black px-3 min-w-1/4 text-left text-base border-2 border-solid border-green-900 rounded-md `}
								name='maxNumberOfFiles'
								value={submissionData.maxNumberOfFiles}
								onChange={(e) => {
									setSubmissionData({
										...submissionData,
										maxNumberOfFiles: e.target.value,
									})
								}}
								disabled
							>
								<option className='' value={1}>
									1
								</option>
								<option className='' value={2}>
									2
								</option>
								<option className='' value={3}>
									3
								</option>
								<option className='' value={4}>
									4
								</option>
								<option className='' value={5}>
									5
								</option>
							</select>
						</div>
						<div className=' mb-5 h-10 w-full text-xs z-9999'>
							<div className='text-white'>Max file size</div>
							<input
								type='text'
								value={submissionData.maxFileSize}
								disabled
								className='w-full border rounded-lg p-1'
							/>
						</div>
						<div className='flex justify-end m-2'>
							<button
								disabled={updateButtonActive ? false : true}
								className={`${
									updateButtonActive
										? "bg-green-600 text-white font-bold transition-opacity shadow-lg border border-green-900 "
										: "bg-green-900 bg-opacity-50 text-opacity-50 text-gray-50 scale-50"
								} text-base rounded-lg px-6 py-2`}
							>
								Update Info{" "}
							</button>
						</div>
					</div>
				</div>
			)}
		</Layout>
	)
}
import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import Layout from "../../../../components/master/layout"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { ExclamationCircleIcon } from "@heroicons/react/outline"

import DatePicker from "react-datepicker"
import { data } from "autoprefixer"
import * as yup from "yup"
// import RadioQuizType from "../../../../components/classid/createQuiz/RadioQuizType"

let announcementSchema = yup.object().shape({
	announcement_Title: yup.string().max(40, "max title reached!").required(),
	announcement_description: yup.string().required(),
	publish_time: yup.date().required(),
	in_intake_oID: yup.string().required(),
	bgcolor: yup.string().required(),
})

export default function CreateQuiz() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid, intake_name } = router.query
	const [announcementData, setAnnouncementData] = useState({
		announcement_Title: "",
		announcement_description: "",
		publish_time: new Date(),
		bgcolor: "bg-red-500",
		in_intake_oID: "",
	})
	const [submitButtonActive, setSubmitButtonActive] = useState(false)

	const loadPage = async () => {
		setAnnouncementData({ ...announcementData, in_intake_oID: intakeid })
	}

	useEffect(async () => {
		if (Object.keys(router.query).length && status === "authenticated") {
			console.log("router Query Activated")
			await loadPage()
		}
	}, [router.query, status])

	useEffect(async () => {
		console.log(announcementData)
		await announcementSchema.isValid(announcementData).then((valid) => {
			console.log("valid", valid)
			if (valid) {
				setSubmitButtonActive(true)
				console.log("Upload Button should be activated")
			} else {
				setSubmitButtonActive(false)
				console.log("Upload Button should not be activated")
			}
		})
	}, [announcementData])

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
					<ExclamationCircleIcon className='w-10 h-auto text-white inline-block mr-2' />
					<div className='inline-block text-white text-xl self-center'>
						Create Announcement
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
							value={announcementData.announcement_Title}
							onChange={(e) => {
								setAnnouncementData({
									...announcementData,
									announcement_Title: e.target.value,
								})
							}}
						/>
					</div>
					<div className='mb-3 text-xs  '>
						<div className='text-white'>Announcement Description</div>
						<textarea
							className='w-full text-xs border rounded-lg p-1'
							type='textarea'
							required={true}
							placeholder='Give the Announcement a description...'
							name='description'
							maxLength={200}
							value={announcementData.announcement_description}
							onChange={(e) => {
								setAnnouncementData({
									...announcementData,
									announcement_description: e.target.value,
								})
							}}
							rows={3}
						/>
					</div>

					<div className=' mb-5 h-10 w-full text-xs z-9999'>
						<div className='text-white'>Announcement on</div>
						<DatePicker
							className='border rounded-md p-1 pl-2 w-full'
							name='publish_time'
							selected={announcementData.publish_time}
							showTimeSelect
							timeFormat='HH:mm'
							timeIntervals={15}
							dateFormat='dd/MM/yyyy h:mm aa'
							onChange={(date) =>
								setAnnouncementData({
									...announcementData,
									publish_time: new Date(date),
								})
							}
						/>
					</div>
					<div className=' mb-5 h-10 w-full text-xs z-9999'>
						<div className='text-white'>Announcement Bookmark color</div>
						<select
							className={`appearance-none text-white px-1  text-left text-base border-2 border-solid border-green-900 rounded-lg ${announcementData.bgcolor} `}
							name='bgcolor'
							value={announcementData.bgcolor}
							onChange={(e) => {
								setAnnouncementData({
									...announcementData,
									bgcolor: e.target.value,
								})
							}}
						>
							<option className='text-red-700 bg-white ' value='bg-red-500'>
								Red
							</option>
							<option
								className='text-yellow-700 bg-white'
								value='bg-yellow-500'
							>
								Yellow
							</option>
							<option className='text-green-700 bg-white' value='bg-green-500'>
								Green
							</option>
						</select>
					</div>
				</div>
				<div className='flex justify-end m-2'>
					<button
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

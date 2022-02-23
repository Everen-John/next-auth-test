import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { BookmarkAltIcon } from "@heroicons/react/outline"
import * as yup from "yup"
import Layout from "../components/master/layout"

import CalendarBlock from "../components/index/ClassesJoined/Calendar/calendarBlock"
import ClassesJoined from "../components/index/ClassesJoined/ClassesDisplay/classesJoinedBlock"
import CalendarCell from "../components/index/ClassesJoined/Calendar/calendarCell"

let classSchema = yup.object().shape({
	className: yup.string().min(2).required("Class name is required"),
	intakeName: yup.string().min(2).required("Intake name is required"),
	icon: yup.string().notRequired(),
})

export default function CreateClass() {
	const router = useRouter()
	const { data: session, status } = useSession()
	const [submitButtonActive, setSubmitButtonActive] = useState(false)
	const [classData, setClassData] = useState({
		className: "",
		intakeName: "",
		icon: "",
	})

	const createClass = async () => {
		console.log("Ran createClass")
		try {
			let res = await fetch("/api/createClass", {
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
					className: classData.className,
					intakeName: classData.intakeName,
					icon: classData.icon,
				}), // body data type must match "Content-Type" header
			})
				.then((res) => res.json())
				.catch((e) => console.log(e))
			return res
		} catch (e) {
			console.log(e)
		}
	}
	const handleSubmit = () => {
		setSubmitButtonActive(false)
		return new Promise(async (resolve, reject) => {
			await createClass()
				.then((res) => {
					if (res.success) {
						console.log(res)
						window.alert("Class created successfully!")
						router.push(`/Created/${res.classid}`)
					} else {
						window.alert("Error creating class")
					}
				})
				.catch((e) => {
					console.log(e)
					setSubmitButtonActive(true)
				})
		})
	}

	useEffect(() => {
		classSchema
			.isValid(classData)
			.then((valid) => {
				console.log(valid)
				if (valid) {
					setSubmitButtonActive(true)
				} else {
					setSubmitButtonActive(false)
				}
			})
			.catch((err) => {
				console.log(err)
				setSubmitButtonActive(false)
			})
	}, [classData])

	return (
		<Layout session={session}>
			<div>
				<div className='bg-green-700 m-2 px-3 py-3 rounded-md flex'>
					<BookmarkAltIcon className='w-10 h-auto text-white inline-block mr-2' />
					<div className='inline-block text-white text-xl self-center'>
						Create a new class
					</div>
				</div>
				<div className='bg-green-700 m-2 px-3 py-3 rounded-md'>
					<div className='mb-3 text-xs  '>
						<div className='text-white'>Class Name</div>
						<input
							className='h-10 w-full border rounded-lg p-1'
							type='text'
							required={true}
							placeholder='Give the class a name...'
							name='className'
							maxLength={40}
							value={classData.className}
							onChange={(e) => {
								setClassData({
									...classData,
									className: e.target.value,
								})
							}}
						/>
					</div>

					<div className='mb-3 text-xs  '>
						<div className='text-white'>First Intake Name</div>
						<input
							className='h-10 w-full border rounded-lg p-1'
							type='text'
							required={true}
							placeholder='Give the intake a name...'
							name='intakeName'
							maxLength={40}
							value={classData.intakeName}
							onChange={(e) => {
								setClassData({
									...classData,
									intakeName: e.target.value,
								})
							}}
						/>
					</div>

					<div className='mb-3 text-xs  '>
						<div className='text-white'>Icons (WIP)</div>
						<input
							className='h-10 w-full rounded-lg p-1'
							type='text'
							required={true}
							name='intakeName'
							maxLength={40}
							value={classData.icon}
							readOnly={true}
							disabled={true}
							onChange={(e) => {
								setClassData({
									...classData,
									icon: e.target.value,
								})
							}}
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

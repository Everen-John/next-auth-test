import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { BookmarkAltIcon } from "@heroicons/react/outline"
import * as yup from "yup"
import Layout from "../../../components/master/layout"

let intakeSchema = yup.object().shape({
	classid: yup.string().required("Class name is required"),
	intakeName: yup.string().min(2).required("Intake name is required"),
})

export default function CreateIntake() {
	const router = useRouter()
	const { classid, class_name } = router.query
	const { data: session, status } = useSession()
	const [submitButtonActive, setSubmitButtonActive] = useState(false)
	const [intakeData, setIntakeData] = useState({
		classid: "",
		intakeName: "",
		icon: "",
	})

	const createIntake = async () => {
		console.log("Ran createIntake")
		try {
			let res = await fetch("/api/createIntake", {
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
					classid: intakeData.classid,
					intakeName: intakeData.intakeName,
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
			await createIntake()
				.then((res) => {
					if (res.success) {
						console.log(res)
						window.alert("Intake created successfully!")
						router.push(`/Created/${classid}?get_intake_id=${res.intakeid}`)
					} else {
						window.alert("Error creating intake!")
					}
				})
				.catch((e) => {
					console.log(e)
					setSubmitButtonActive(true)
				})
		})
	}

	useEffect(() => {
		console.log("RouterQuery", router.query)
		setIntakeData({
			classid: classid,
			intakeName: "",
		})
	}, [router.query])

	useEffect(() => {
		console.log(intakeData)
		intakeSchema
			.isValid(intakeData)
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
	}, [intakeData])

	return (
		<Layout session={session}>
			<div>
				<div className='bg-green-700 m-2 px-3 py-3 rounded-md flex'>
					<BookmarkAltIcon className='w-10 h-auto text-white inline-block mr-2' />
					<div className='inline-block text-white text-xl self-center'>
						Create a new Intake for {class_name}
					</div>
				</div>
				<div className='bg-green-700 m-2 px-3 py-3 rounded-md'>
					<div className='mb-3 text-xs  '>
						<div className='text-white'>New Intake Name</div>
						<input
							className='h-10 w-full border rounded-lg p-1'
							type='text'
							required={true}
							placeholder='Give the intake a name...'
							name='intakeName'
							maxLength={40}
							value={intakeData.intakeName}
							onChange={(e) => {
								setIntakeData({
									...intakeData,
									intakeName: e.target.value,
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

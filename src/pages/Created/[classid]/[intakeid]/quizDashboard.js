import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import Layout from "../../../../components/master/layout"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Image from "next/image"
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/outline"
import FABButton from "../../../../components/classid/createQuiz/createQuizFABButton"
import FITBQuizType from "../../../../components/classid/createQuiz/FITBQuizType"
import RadioQuizType from "../../../../components/classid/createQuiz/radioQuizType"
import CheckboxQuizType from "../../../../components/classid/createQuiz/checkboxQuizType"
import EssayQuizType from "../../../../components/classid/createQuiz/essayQuizType"
import DatePicker from "react-datepicker"
import { data } from "autoprefixer"
import * as yup from "yup"
// import RadioQuizType from "../../../../components/classid/createQuiz/RadioQuizType"

export default function QuizDashboard() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid, intake_name, quizid } = router.query
	const [loading, setLoading] = useState(true)
	const [quizData, setQuizData] = useState()

	const loadPage = async () => {
		return new Promise(async (resolve, reject) => {
			let quizData = await getQuizData()
			resolve(quizData)
		})
			.then((quizData) => {
				console.log(quizData)
				setQuizData(quizData)
			})
			.then(() => {
				setLoading(false)
			})
	}

	const getQuizData = async () => {
		console.log("Ran uploadQuiz")
		try {
			let res = await fetch("/api/classCreatedData/getQuizData", {
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
					quizid: quizid,
				}), // body data type must match "Content-Type" header
			})
				.then((res) => res.json())
				.catch((e) => console.log(e))
			return res
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(async () => {
		if (Object.keys(router.query).length && status === "authenticated") {
			console.log("router Query Activated")
			await loadPage()
		}
	}, [router.query, status])

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
				<div className='bg-gray-100 m-3 p-3 rounded-md shadow-xl'>
					<div className='font-bold text-xl'>{quizData.title}</div>
					<div className='text-5xs'>{quizData.description}</div>
					<div className='text-2xs'>Publish time: {quizData.publish_time}</div>
					<div className='text-2xs'>Deadline: {quizData.deadline}</div>
					<div className='text-2xs'>
						Completion time: {quizData.completionTime}
					</div>
					<div className='flex justify-center'>
						<table className='table-fixed  border border-solid border-gray-500'>
							<thead>
								<tr className='border-b border-solid border-gray-400'>
									<th className='w-2/6 px-1 text-3xs'>Name</th>
									<th className='w-2/6 px-1 text-3xs'>Completion Date</th>
									<th className='w-1/6 px-1 text-3xs'>Completion time</th>
									<th className='w-1/6 px-1 text-3xs'>Score</th>
								</tr>
							</thead>
							<tbody className='text-2xs'>
								{quizData.attempters.map((item, key) => {
									return (
										<tr
											key={key}
											className={key % 2 === 0 ? "bg-gray-300" : null}
										>
											<td className='border border-solid border-gray-500 px-1'>
												{item.attempter_name}
											</td>
											<td className='border border-solid border-gray-500 px-1'>
												{item.completedDate}
											</td>
											<td className='border border-solid border-gray-500 px-1'>
												{item.completedAfter}
											</td>
											<td className='border border-solid border-gray-500 px-1'>
												{item.score}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</Layout>
	)
}

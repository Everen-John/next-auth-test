import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

import Layout from "../../../../../../components/master/layout"

export default function Intakeid() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [reportData, setReportData] = useState()
	const { intakeid, quizid, intake_name } = router.query

	const loadPage = async () => {
		return new Promise(async (resolve, reject) => {
			let quizReportData = await getQuizReportData()
			resolve(quizReportData)
		})
			.then(async (quizReportData) => {
				console.log("quizReportData", quizReportData)
				setReportData(quizReportData)
				return
			})
			.then(() => {
				setLoading(false)
			})
	}
	const getQuizReportData = async () => {
		try {
			let finalResults = await fetch("/api/classJoinedData/getQuizReportData", {
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
					quizid: quizid,
					intakeid: intakeid,
				}), // body data type must match "Content-Type" header
			})
				.then((res) => res.json())
				.then((res) => {
					return res
				})
			return finalResults
		} catch (e) {}
	}

	useEffect(async () => {
		console.log(Object.keys(router.query).length)
		//TODO: Authentication code here if not NextJS 12.
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
				<Link href={`/Joined/${intakeid}`}>
					<a className='text-green-400 mx-2 '>{intake_name}</a>
				</Link>
			</div>
			{loading || !reportData ? (
				<div className='flex justify-center m-10'>
					<Image
						src='/Loaders/tail-spin.svg'
						width={100}
						height={100}
						alt='spinner'
					/>
				</div>
			) : (
				<div className='m-2'>
					<div className='bg-white shadow-xl rounded-md mb-3 p-4'>
						<div className='flex justify-center text-3xl mb-3 border-b-2 border-gray-300'>
							Quiz Report
						</div>
						<div className='text-2xs mb-3'>
							<div>
								Time to complete: {reportData.attempters.completedAfter}
							</div>
							<div>Date completed: {reportData.attempters.completedDate}</div>
						</div>
						<div className='flex justify-center'>
							<div
								className={`text-6xl border border-solid p-5 rounded-full ${
									reportData.attempters.score < 50
										? "border-red-500"
										: reportData.attempters.score < 75
										? "border-yellow-500"
										: "border-green-600"
								}`}
							>
								{reportData.attempters.score}
							</div>
							<div className='self-end'>/100</div>
						</div>
					</div>
					<div className='flex justify-end'>
						<button
							className='bg-green-700 text-white font-bold px-6 py-1 rounded-md'
							onClick={() => router.push(`/Joined/${intakeid}`)}
						>
							Ok
						</button>
					</div>
				</div>
			)}
		</Layout>
	)
}

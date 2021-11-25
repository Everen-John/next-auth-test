import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"
import * as yup from "yup"
import dynamic from "next/dynamic"
import Layout from "../../../../components/master/layout"
import DatePicker from "react-datepicker"
import ClassJoinedCellAnnouncement from "../../../../components/intakeid/classJoinedCellAnnouncement"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function ContentId() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { intakeid, contentid, intake_name } = router.query

	const loadPage = async () => {
		return new Promise((resove, reject) => {
			console.log("Load Page!")
		})
	}
	const getContent = async () => {
		console.log("Ran getContent")
		if (status === "authenticated") {
			try {
				let res = await fetch("/api/classJoinedData/getContentData", {
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
						contentid: contentid,
						intakeid: intakeid,
					}), // body data type must match "Content-Type" header
				})
					.then((res) => res.json())
					.then((res) => setContentData(res))
					.catch((e) => console.log(e))
			} catch (e) {
				console.log(e)
			}
		}
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
			<Head>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<meta charSet='utf-8' />
				<title>{intakeid} | File Submission</title>
			</Head>
			<div className='m-2 text-xs text-white'>
				<Link href='/'>
					<a className='text-green-400 mx-2'>Home</a>
				</Link>
				{" > "}
				<Link href={`/Joined/${intakeid}`}>
					<a className='text-green-400 mx-2 '>{intake_name}</a>
				</Link>
			</div>
		</Layout>
	)
}

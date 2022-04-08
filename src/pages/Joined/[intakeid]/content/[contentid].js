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
	const [enableEditor, setEnableEditor] = useState(false)
	const [contentData, setContentData] = useState()

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

	// useEffect(() => {
	// 	// loadQuill()
	// }, [])

	useEffect(() => {
		if (intakeid && contentid && status === "authenticated") {
			getContent()
		} else {
			console.log("Waiting for initial data!")
		}
	}, [intakeid, contentid, status])

	useEffect(() => {
		if (contentData) {
			setEnableEditor(true)
		}
	}, [contentData])

	return (
		<Layout session={session}>
			<Head>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<meta charSet='utf-8' />
				<title>View Content</title>
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
			{enableEditor ? (
				<div className='m-2'>
					<div className='text-xl bg-gray-800 m-2 rounded-md pl-2 text-green-400 shadow'>
						{contentData.contentData.title}
					</div>
					<div className='text-2xs bg-gray-800 m-2 rounded-md pl-2 text-green-400 shadow'>
						{contentData.contentData.description}
					</div>
					<div className='flex p-2'>
						<ReactQuill
							className='h-full bg-gradient-to-b from-white to-gray-100 w-full min-h-full shadow'
							value={contentData.contentData.content_markup}
							modules={{ toolbar: false }}
							readOnly={true}
							theme='snow'
						/>
					</div>
					<div className='text-2xs text-white '>
						Published for: {contentData.contentData.publish_time}
					</div>
				</div>
			) : null}
		</Layout>
	)
}

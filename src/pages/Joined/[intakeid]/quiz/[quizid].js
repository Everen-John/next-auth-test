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
import { route } from "next/dist/server/router"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function ContentId() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { intakeid, quizid, intake_name } = router.query
	const [quizData, setQuizData] = useState()
	const [quizEnabled, setQuizEnabled] = useState(false)
	const [answerSheet, setAnswerSheet] = useState()
	const [startQuiz, setStartQuiz] = useState(false)
	const [questionIndex, setQuestionIndex] = useState(0)

	const getQuiz = async () => {
		console.log("Ran getQuiz")
		if (status === "authenticated") {
			try {
				await fetch("/api/classJoinedData/getQuizData", {
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
						quizid: quizid,
						intakeid: intakeid,
					}), // body data type must match "Content-Type" header
				})
					.then((res) => res.json())
					.then((res) => setQuizData(res))
					.catch((e) => console.log(e))
			} catch (e) {
				console.log(e)
			}
		}
	}

	const generateAnswerSheet = () => {
		const fitbAnswerGenerator = (length) => {
			let answerArray = []
			for (let i = 0; i < length; i++) {
				answerArray.push("")
			}
			return answerArray
		}
		let questions = JSON.parse(JSON.stringify(quizData.questions))
		let answerSheet = []
		questions.map((item, key) => {
			switch (item.question_type) {
				case "FITB":
					answerSheet.push({
						type: "fitb",
						answers: fitbAnswerGenerator(item.fitb_answers_length),
					})
					break
				case "checkbox":
					answerSheet.push({
						type: "checkbox",
						answers: [],
					})
					break
				case "radio":
					answerSheet.push({
						type: "radio",
						answers: null,
					})
					break
				case "essay":
					answerSheet.push({
						type: "essay",
						answers: "",
					})
					break
				default:
					break
			}
		})
		setAnswerSheet(answerSheet)
	}

	useEffect(async () => {
		console.log("router query", router.query)
		if (intakeid && quizid && status === "authenticated") {
			console.log("Ready!")
			getQuiz()
		} else {
			console.log("Waiting for initial data!")
		}
	}, [router.query, status])

	useEffect(() => {
		console.log("quizData", quizData)
		if (quizData) {
			generateAnswerSheet()
		}
	}, [quizData])

	useEffect(() => {
		if (answerSheet) {
			setQuizEnabled(true)
		}
	}, [answerSheet])

	return (
		<Layout session={session}>
			<Head>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<meta charSet='utf-8' />
				<title>Quiz</title>
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

			{quizEnabled ? (
				<div className='p-3'>
					<div className='mb-3 bg-green-100'>
						<div>{quizData.title}</div>
						<div>{quizData.description}</div>
						<div>
							You have {quizData.completionTime} minutes to complete the quiz.
						</div>
						<div>Click Start whenever you're ready.</div>
					</div>
					<div>
						<div className=' mb-3 overflow-visible bg-green-300'>
							<button className=''>Start</button>
						</div>
					</div>
				</div>
			) : (
				<div>Quiz is not enabled</div>
			)}
		</Layout>
	)
}

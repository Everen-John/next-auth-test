import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"
import * as yup from "yup"
import dynamic from "next/dynamic"
import Layout from "../../../../../components/master/layout"
import DatePicker from "react-datepicker"
import ClassJoinedCellAnnouncement from "../../../../../components/intakeid/classJoinedCellAnnouncement"
import { route } from "next/dist/server/router"
import RadioComponent from "../../../../../components/intakeid/quizid/radioComponent"
import FitbComponent from "../../../../../components/intakeid/quizid/fitbComponent"
import CheckboxComponent from "../../../../../components/intakeid/quizid/checkboxComponent"
import EssayComponent from "../../../../../components/intakeid/quizid/essayComponent"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function QuizId() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { intakeid, quizid, intake_name } = router.query
	const [quizData, setQuizData] = useState()
	const [quizEnabled, setQuizEnabled] = useState(false)
	const [answerSheet, setAnswerSheet] = useState()
	const [startQuiz, setStartQuiz] = useState(0)
	const [questionIndex, setQuestionIndex] = useState()
	const [questionData, setQuestionData] = useState()
	const [nextButtonActive, setNextButtonActive] = useState(false)
	const [isLastQuestion, setIsLastQuestion] = useState(false)

	const loadPage = async () => {
		return new Promise(async (resolve, reject) => {
			let quizAttemptCheck = await checkQuizAttempt()

			resolve(quizAttemptCheck)
		})
			.then(async (quizAttemptCheck) => {
				let quizData
				let quill
				if (quizAttemptCheck.attempted) {
					router.push(
						`/Joined/${intakeid}/quiz/${quizid}/quizReport?intake_name=TCP/IP`
					)
				} else {
					quizData = await getQuiz()
					quill = await loadQuill()
				}

				return { quizData, quill }
			})
			.then(async ({ quizData }) => {
				let answerSheet = generateAnswerSheet(quizData)
				return { answerSheet, quizData }
			})
			.then(async ({ answerSheet, quizData }) => {
				setAnswerSheet(answerSheet)
				setQuizData(quizData)
				// submitMockQuiz()
			})
			.then(() => {
				setQuizEnabled(true)
				setQuestionIndex(0)
			})
			.catch((e) => {})
	}

	const performSubmissionAndEndQuizSession = async () => {
		console.log("Perform submission called")
		return new Promise(async (resolve, reject) => {
			let submissionStatus = await submitQuiz()
			resolve(submissionStatus)
		}).then((submissionStatus) => {
			if (submissionStatus.msg === "ok") {
				window.alert("Submitted successfully!")
				router.push(
					`/Joined/${intakeid}/quiz/${quizid}/quizReport?intake_name=${encodeURI(
						intake_name
					)}`
				)
			}
		})
	}

	const checkQuizAttempt = async () => {
		if (status === "authenticated") {
			try {
				let finalResults = await fetch("/api/classJoinedData/getQuizAttempt", {
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
					.then((res) => {
						console.log(res)
						return res
					})
					.catch((e) => console.log(e))
				return finalResults
			} catch (e) {
				console.log(e)
			}
		}
	}

	const getQuiz = async () => {
		if (status === "authenticated") {
			try {
				let finalResults = await fetch("/api/classJoinedData/getQuizData", {
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
					.then((res) => {
						console.log(res)
						return res
					})
					.catch((e) => console.log(e))
				return finalResults
			} catch (e) {
				console.log(e)
			}
		}
	}

	const submitQuiz = async () => {
		console.log("in submit quiz", answerSheet)
		try {
			let finalResults = await fetch("/api/classJoinedData/submitQuizAnswer", {
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
					name: session.user.name,
					quizid: quizid,
					intakeid: intakeid,
					answerSheet: answerSheet,
					completionTime: quizData.completionTime,
				}), // body data type must match "Content-Type" header
			})
				.then((res) => res.json())
				.then((res) => {
					console.log(res)
					return res
				})
				.catch((e) => console.log(e))
			return finalResults
		} catch (e) {
			console.log(e)
		}
	}

	const loadQuill = async () => {
		const Quill = await require("react-quill").Quill
	}

	const generateAnswerSheet = (quizData) => {
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
		return answerSheet
	}

	const generateOneQuestion = () => {
		console.log("generateOneQuestion is called?")
		switch (questionData.question_type) {
			case "FITB":
				return (
					<FitbComponent
						index={questionIndex}
						questionData={questionData}
						answerRegisterer={answerRegisterer}
						answerPage={answerSheet[questionIndex]}
						nextButtonActive={nextButtonActive}
						// nextButtonEnabler={nextButtonEnabler}
						nextButtonHandler={nextButtonHandler}
						isLastQuestion={isLastQuestion}
					/>
				)
				break
			case "radio":
				return (
					<RadioComponent
						index={questionIndex}
						questionData={questionData}
						answerRegisterer={answerRegisterer}
						answerPage={answerSheet[questionIndex]}
						nextButtonActive={nextButtonActive}
						// nextButtonEnabler={nextButtonEnabler}
						nextButtonHandler={nextButtonHandler}
						isLastQuestion={isLastQuestion}
					/>
				)
				break
			case "checkbox":
				return (
					<CheckboxComponent
						index={questionIndex}
						questionData={questionData}
						answerRegisterer={answerRegisterer}
						answerPage={answerSheet[questionIndex]}
						nextButtonActive={nextButtonActive}
						// nextButtonEnabler={nextButtonEnabler}
						nextButtonHandler={nextButtonHandler}
						isLastQuestion={isLastQuestion}
					/>
				)
				break
			case "essay":
				return (
					<EssayComponent
						index={questionIndex}
						questionData={questionData}
						answerRegisterer={answerRegisterer}
						answerPage={answerSheet[questionIndex]}
						nextButtonActive={nextButtonActive}
						// nextButtonEnabler={nextButtonEnabler}
						nextButtonHandler={nextButtonHandler}
						isLastQuestion={isLastQuestion}
					/>
				)
				break
			default:
				console.log("Nothing here!")
				break
		}
	}

	const answerRegisterer = (index, answerValue) => {
		console.log("Question:", index, "Answer:", answerValue)
		let answerSheetTemp = JSON.parse(JSON.stringify(answerSheet))
		console.log(answerSheetTemp)
		answerSheetTemp[index] = answerValue
		setAnswerSheet(answerSheetTemp)
		enableNextButton(answerValue)
	}

	// const nextButtonEnabler = (enableBool) => {
	// 	console.log("ButtonEnabler called with:", enableBool)
	// 	setNextButtonActive(enableBool)
	// }

	const enableNextButton = (answerValue) => {
		console.log(answerValue)
		console.log("enableNextButton is called!")
		switch (answerValue.type) {
			case "fitb":
			case "radio":
			case "essay":
				console.log("Null check doing")
				if (answerValue.answers != null) {
					setNextButtonActive(true)
				} else setNextButtonActive(false)
				break
			case "checkbox":
				if (answerValue.answers.length != 0) {
					setNextButtonActive(true)
				} else {
					setNextButtonActive(false)
				}
				break
			default:
				console.log("default is called!")
		}
	}
	const nextButtonHandler = () => {
		console.log("nextButtonHandler called!")
		setQuestionIndex(questionIndex + 1)
		setNextButtonActive(false)
	}

	useEffect(async () => {
		console.log("router query", router.query)
		if (intakeid && quizid && status === "authenticated") {
			console.log("Ready!")
			loadPage()
		} else {
			console.log("Waiting for initial data!")
		}
	}, [router.query, status])

	useEffect(async () => {
		console.log("startQuiz", startQuiz)
		if (startQuiz === 1) {
			setQuestionData(quizData.questions[0])
			setQuestionIndex(0)
			setStartQuiz(2)
		}
	}, [startQuiz])

	useEffect(() => {
		if (quizData) {
			console.log("questionData", questionData)
		}
	}, [questionData])

	useEffect(() => {
		console.log("Answer Sheet has been Changed!", answerSheet)
	}, [answerSheet])

	useEffect(async () => {
		console.log("questionIndex", questionIndex)
		if (quizData) {
			console.log("quizData length", quizData.questions.length)
		}

		if (questionIndex) {
			if (questionIndex < quizData.questions.length - 1) {
				setQuestionData(quizData.questions[questionIndex])
				generateOneQuestion()
			} else if (questionIndex === quizData.questions.length - 1) {
				setIsLastQuestion(true)
				setQuestionData(quizData.questions[questionIndex])
				generateOneQuestion()
			} else if (questionIndex > quizData.questions.length - 1) {
				console.log("Submission time!")
				performSubmissionAndEndQuizSession()
			}
		}
	}, [questionIndex])

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
					<div>
						<div className='mb-3'>
							<div className='bg-gray-800 text-green-400 text-xl font-bold p-2 rounded-md shadow-md mx-2'>
								{quizData.title}
							</div>
							{startQuiz === 0 ? (
								<div>
									<div className='bg-gray-100 m-3 shadow-md rounded-md p-3 flex flex-col items-center min-h-60vh justify-around'>
										<div className=''>
											<div className='text-2xs'>{quizData.description}</div>
											<div className='text-2xs'>
												You have {quizData.completionTime} minutes to complete
												the quiz. There are {quizData.questions.length}{" "}
												questions in this quiz.
											</div>
											<div className='text-base'>
												Click Start whenever you're ready.
											</div>
										</div>

										<button
											className={`mb-3 
									overflow-visible 
									text-white 
									shadow-md 
									text-2xl 
									font-semibold 
									px-10 
									rounded-md 
									bg-gradient-to-r 
									from-green-500
									to-green-800 
									animate-gradient-xy`}
											onClick={(e) => setStartQuiz(1)}
										>
											Start
										</button>
									</div>
								</div>
							) : null}
							{startQuiz === 2 && questionIndex <= quizData.questions.length - 1
								? generateOneQuestion()
								: null}
						</div>
					</div>
				</div>
			) : (
				<div>Quiz is not enabled</div>
			)}
		</Layout>
	)
}

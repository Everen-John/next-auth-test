import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import Layout from "../../../../components/master/layout"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
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

let quizFormUploadSchema = yup.object().shape({
	title: yup.string().max(40, "max title reached!").required(),
	description: yup.string().max(100, "Reached Maximum Length!").required(),
	publish_time: yup.date().required(),
	deadline: yup.date().required(),
	in_intake_oID: yup.string().required(),
	questions: yup.array().min(1).required(),
})

let FITBSchema = yup.object().shape({
	fitb_answers: yup.array().min(1).required(),
	question_text: yup.string().max(2000000, "Max keywords reached!").required(),
	question_type: yup.string().required(),
})

let radioSchema = yup.object().shape({
	radio_answer: yup.number().required(),
	radio_values: yup.array().min(2).required(),
	question_text: yup.string().max(2000000, "Max keywords reached!").required(),
	question_type: yup.string().required(),
})

let checkboxSchema = yup.object().shape({
	checkbox_answers: yup.array().min(1).required(),
	checkbox_values: yup.array().min(2).required(),
	question_text: yup.string().max(2000000, "Max keywords reached!").required(),
	question_type: yup.string().required(),
})

let essaySchema = yup.object().shape({
	question_text: yup.string().max(2000000, "Max keywords reached!").required(),
	question_type: yup.string().required(),
})

let quillModules = {
	markdownShortcuts: false,
	magicUrl: true,
	imageCompress: {
		quality: 0.5, // default
		maxWidth: 1000, // default
		maxHeight: 1000, // default
		imageType: "image/jpeg", // default
		debug: false, // default
		suppressErrorLogging: false, // default
	},
	blotFormatter: {
		// see config options below
		debug: false,
	},
	toolbar: [
		[{ header: [1, 2, 3, 4, false] }],
		[{ color: [] }, { background: [] }],
		["bold", "italic", "underline", "strike", "blockquote", "code"],
		[
			{ list: "ordered" },
			{ list: "bullet" },
			{ indent: "-1" },
			{ indent: "+1" },
		],
		[
			{ align: null },
			{ align: "center" },
			{ align: "right" },
			{ align: "justify" },
		],
		["link", "image", "video"],
		["clean"],
	],
}

let quillFormats = [
	"header",
	"bold",
	"italic",
	"underline",
	"strike",
	"color",
	"background",
	"blockquote",
	"code",
	"list",
	"bullet",
	"indent",
	"align",
	"link",
	"image",
	"video",
]

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function CreateQuiz() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid, intake_name } = router.query
	const [formLoading, setFormLoading] = useState(true)
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		publish_time: new Date(),
		deadline: new Date(),
		in_intake_oID: "",
		questions: {},
	})
	const [quizData, setQuizData] = useState([])

	const uploadQuiz = async () => {
		console.log("Ran uploadQuiz")
		try {
			let res = await fetch("/api/classCreatedData/createQuiz", {
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
					formData: formData,
					user: session.user.id,
				}), // body data type must match "Content-Type" header
			})
				.then((res) => res.json())
				.catch((e) => console.log(e))
			if (res.msg === "ok") {
				window.alert("Updated Successfully!")
				router.push(`../../${classid}`)
			}
		} catch (e) {
			console.log(e)
		}
	}

	const loadQuill = async () => {
		return new Promise(async (resolve, reject) => {
			const Quill = await require("react-quill").Quill
			const BlotFormatter = (await import("quill-blot-formatter-mobile"))
				.default
			const magicUrl = (await import("quill-magic-url")).default
			const ImageCompress = (await import("quill-image-compress")).default
			const MarkdownShortcuts = (await import("quill-markdown-shortcuts"))
				.default
			resolve({
				Quill,
				BlotFormatter,
				magicUrl,
				ImageCompress,
				MarkdownShortcuts,
			})
		})
			.then(
				({
					Quill,
					BlotFormatter,
					magicUrl,
					ImageCompress,
					MarkdownShortcuts,
				}) => {
					Quill.register("modules/blotFormatter", BlotFormatter)
					Quill.register("modules/magicUrl", magicUrl)
					Quill.register("modules/imageCompress", ImageCompress)
					Quill.register("modules/markdownShortcuts", MarkdownShortcuts)
					return
				}
			)
			.then((value) => {
				setFormLoading(false)
			})
	}

	const addNewFITBQuestion = () => {
		setQuizData([
			...quizData,
			{ question_text: "", question_type: "FITB", fitb_answers: [""] },
		])
	}

	const removeQuestion = (key) => {
		let tempQuizData = quizData
		console.log("RemoveQuestion: ", tempQuizData)
		tempQuizData.splice(key, 1)
		console.log("Spliced:", tempQuizData)
		setQuizData([...tempQuizData])
	}

	const addNewCheckboxQuestion = () => {
		setQuizData([
			...quizData,
			{
				question_text: "",
				question_type: "checkbox",
				checkbox_values: ["", ""],
				checkbox_answers: [],
			},
		])
	}

	const addNewRadioQuestion = () => {
		setQuizData([
			...quizData,
			{
				question_text: "",
				question_type: "radio",
				radio_values: ["", ""],
				radio_answer: null,
			},
		])
	}

	const addNewEssayQuestion = () => {
		setQuizData([...quizData, { question_text: "", question_type: "essay" }])
	}

	const quizDataChangeHandler = (quizDataChild, quizDataChildIndex) => {
		let tempQuizData = JSON.parse(JSON.stringify(quizData))
		tempQuizData[quizDataChildIndex] = quizDataChild
		setQuizData(tempQuizData)
	}

	useEffect(() => {
		loadQuill()
	}, [])

	useEffect(() => {
		console.log(formData)
	}, [formData])

	useEffect(async () => {
		console.log("router query", router.query)
		setFormData({
			...formData,
			in_intake_oID: await router.query.intakeid,
		})
	}, [router.query])

	useEffect(() => {
		setFormData({
			...formData,
			questions: quizData,
		})
	}, [quizData])

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
				<div className='bg-gray-800 p-1 pl-3 m-2 mb-6 rounded-md text-green-500 text-xl'>
					Create New Quiz
				</div>
				<div className='px-4'>
					<div>
						<input
							className='mb-1 h-10 w-full text-xs border rounded-lg p-1'
							type='text'
							required={true}
							placeholder='Give the upload a Title...'
							name='title'
							onChange={(e) => {
								setFormData({
									...formData,
									title: e.target.value,
								})
							}}
						/>
						<textarea
							className=' mb-1 h-20 w-full text-xs border rounded-lg p-1'
							type='textarea'
							required={true}
							placeholder='Give the upload a description...'
							name='description'
							maxLength={200}
							onChange={(e) => {
								setFormData({
									...formData,
									description: e.target.value,
								})
							}}
							rows={4}
						/>

						<div className=' mb-1 h-14 w-full text-xs text-white z-9999'>
							<div>Publish time</div>
							<DatePicker
								className='border rounded-md p-1 pl-2 w-full text-black'
								name='publish_time'
								selected={formData.publish_time}
								dateFormat='dd/MM/yyyy'
								onChange={(date) =>
									setFormData({
										...formData,
										publish_time: new Date(date),
									})
								}
							/>
						</div>
						<div className=' mb-1 h-14 w-full text-xs text-white z-9999'>
							<div>Deadline</div>
							<DatePicker
								className='border rounded-md p-1 pl-2 w-full text-black'
								name='deadline'
								selected={formData.deadline}
								dateFormat='dd/MM/yyyy'
								onChange={(date) =>
									setFormData({
										...formData,
										deadline: new Date(date),
									})
								}
							/>
						</div>

						<input
							type='hidden'
							name='file_deadline'
							value={formData.deadline}
						/>
						<input
							type='hidden'
							name='in_intake_oID'
							value={formData.in_intake_oID}
						/>
					</div>
					{!formLoading && quizData.length === 0 ? (
						<h1 className='text-2xs text-white text-center '>
							Click the bottom right {"  "}
							<PlusIcon className='w-7 h-7 p-2 inline-block bg-green-600 text-green-100 rounded-full hover:bg-green-700 ' />{" "}
							to add a new quiz!
						</h1>
					) : (
						<h1 className='text-xl text-white '>Questions</h1>
					)}
					{formLoading
						? null
						: quizData.map((item, key) => {
								switch (item.question_type) {
									case "FITB":
										return (
											<FITBQuizType
												quillModules={quillModules}
												quillFormats={quillFormats}
												FITBData={item}
												index={key}
												quizDataChangeHandler={quizDataChangeHandler}
												key={key}
												removeQuestion={removeQuestion}
											/>
										)
									case "radio":
										return (
											<RadioQuizType
												quillModules={quillModules}
												quillFormats={quillFormats}
												radioData={item}
												index={key}
												quizDataChangeHandler={quizDataChangeHandler}
												key={key}
												removeQuestion={removeQuestion}
											/>
										)
									case "checkbox":
										return (
											<CheckboxQuizType
												quillModules={quillModules}
												quillFormats={quillFormats}
												checkboxData={item}
												index={key}
												quizDataChangeHandler={quizDataChangeHandler}
												key={key}
												removeQuestion={removeQuestion}
											/>
										)
									case "essay":
										return (
											<EssayQuizType
												quillModules={quillModules}
												quillFormats={quillFormats}
												essayData={item}
												index={key}
												quizDataChangeHandler={quizDataChangeHandler}
												key={key}
												removeQuestion={removeQuestion}
											/>
										)
								}
						  })}
					<button
						type='submit'
						disabled={quizData.length > 0 ? false : true}
						className={`${
							quizData.length > 0
								? "bg-green-600 text-white font-bold transition-opacity shadow-lg border border-green-900 "
								: "bg-green-900 bg-opacity-50 text-opacity-50 text-gray-50 scale-50"
						} mt-4 mb-1 h-8 w-16 text-xs rounded-lg p-1`}
						onClick={uploadQuiz}
					>
						Submit
					</button>
					<FABButton
						addNewCheckboxQuestion={addNewCheckboxQuestion}
						addNewFITBQuestion={addNewFITBQuestion}
						addNewRadioQuestion={addNewRadioQuestion}
						addNewEssayQuestion={addNewEssayQuestion}
					/>
				</div>
			</div>
		</Layout>
	)
}

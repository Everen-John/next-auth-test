import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import Layout from "../../../../components/master/layout"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { PlusCircleIcon } from "@heroicons/react/outline"
import FABButton from "../../../../components/classid/createQuiz/createQuizFABButton"
import FITBQuizType from "../../../../components/classid/createQuiz/FITBQuizType"
// import RadioQuizType from "../../../../components/classid/createQuiz/RadioQuizType"

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

export default function QuizComponent() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid, intake_name } = router.query
	const [formLoading, setFormLoading] = useState(true)
	const [quizData, setQuizData] = useState([])

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

	const addNewCheckboxQuestion = () => {
		setQuizData([
			...quizData,
			{
				question_text: "",
				question_type: "checkbox",
				checkbox_values: [""],
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
				checkbox_values: [""],
				checkbox_answers: [],
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
		console.log(quizData)
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
				<div className='bg-gray-800 p-1 pl-3 m-2 rounded-md text-green-500 text-xl'>
					Create New Quiz
				</div>
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
										/>
									)
								case "radio":
									return (
										<RadioQuizType
											quillModules={quillModules}
											quillFormats={quillFormats}
											RadioData={item}
											index={key}
											quizDataChangeHandler={quizDataChangeHandler}
											key={key}
										/>
									)
								case "checkBox":
								case "essay":
									break
							}
					  })}
				<FABButton
					addNewCheckboxQuestion={addNewCheckboxQuestion}
					addNewFITBQuestion={addNewFITBQuestion}
					addNewRadioQuestion={addNewRadioQuestion}
					addNewEssayQuestion={addNewEssayQuestion}
				/>
			</div>
		</Layout>
	)
}

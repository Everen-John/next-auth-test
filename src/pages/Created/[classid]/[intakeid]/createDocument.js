import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"
import * as yup from "yup"
import dynamic from "next/dynamic"
import Layout from "../../../../components/master/layout"
import DatePicker from "react-datepicker"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

let fileUploadSchema = yup.object().shape({
	title: yup.string().max(40, "max title reached!").required(),
	description: yup.string().max(100, "Reached Maximum Length!").required(),
	publish_time: yup.date().required(),
	deadline: yup.date().required(),
	in_intake_oID: yup.string().required(),
	content_markup: yup.string().max(1000000000).required(),
})

let quillModules = {
	markdownShortcuts: {
		debug: false,
	},
	magicUrl: true,
	imageCompress: {
		quality: 0.6, // default
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
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
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

export default function CreateDocument() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid, intake_name } = router.query
	const [uploadButtonActive, setUploadButtonActive] = useState(false)
	const [enableEditor, setEnableEditor] = useState(false)
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		publish_time: new Date(),
		deadline: new Date(),
		in_intake_oID: "",
		content_markup: "",
	})
	const [editorData, setEditorData] = useState("")

	const uploadContent = async () => {
		console.log("Ran uploadDocument")
		try {
			let res = await fetch("/api/classCreatedData/uploadContent", {
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
					contentData: formData,
					user: session.user.id,
				}), // body data type must match "Content-Type" header
			})
				.then((res) => res.json())
				.catch((e) => console.log(e))
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
				setEnableEditor(true)
			})
	}

	useEffect(() => {
		loadQuill()
	}, [])

	useEffect(() => {
		setFormData({
			...formData,
			content_markup: editorData,
		})
	}, [editorData])

	useEffect(async () => {
		await fileUploadSchema.isValid(formData).then((valid) => {
			console.log("valid", valid)
			if (valid) {
				setUploadButtonActive(true)
				console.log("Upload Button should be activated")
			} else {
				setUploadButtonActive(false)
				console.log("Upload Button should not be activated")
			}
		})
	}, [formData])

	useEffect(() => {
		if (intakeid) {
			setFormData({
				...formData,
				in_intake_oID: intakeid,
			})
		}
	}, [intakeid])

	return (
		<Layout session={session}>
			<Head>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<meta charSet='utf-8' />
				<title>Create Content</title>
			</Head>
			<div className='m-2 text-xs text-white'>
				<Link href='/'>
					<a className='text-green-400 mx-2'>Home</a>
				</Link>
				{" > "}
				<Link href={`/Created/${classid}`}>
					<a className='text-green-400 mx-2 '>{intake_name}</a>
				</Link>
			</div>
			<div className='bg-green-700 m-2'>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						uploadContent()
					}}
				>
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
						className=' mb-1 h-32 w-full text-xs border rounded-lg p-1'
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
					<div className=' mb-1 h-10 w-full text-xs z-9999'>
						<DatePicker
							className='border rounded-md p-1 pl-2 w-full'
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

					<input type='hidden' name='file_deadline' value={formData.deadline} />
					<input
						type='hidden'
						name='in_intake_oID'
						value={formData.in_intake_oID}
					/>

					{enableEditor ? (
						<div className='flex '>
							<ReactQuill
								className='h-full bg-white w-full min-h-full '
								value={editorData}
								onChange={setEditorData}
								modules={quillModules}
								formats={quillFormats}
							/>
						</div>
					) : null}
					<button
						type='submit'
						disabled={uploadButtonActive ? false : true}
						className={`${
							uploadButtonActive
								? "bg-green-600 text-white font-bold transition-opacity shadow-lg border border-green-900 "
								: "bg-green-900 bg-opacity-50 text-opacity-50 text-gray-50 scale-50"
						}h-8 w-16 text-xs rounded-lg p-1`}
					>
						Submit
					</button>
				</form>
			</div>
		</Layout>
	)
}

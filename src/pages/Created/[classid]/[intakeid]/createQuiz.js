import dynamic from "next/dynamic"
import React from "react"
import Layout from "../../../../components/master/layout"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { PlusCircleIcon } from "@heroicons/react/outline"
import FABButton from "../../../../components/classid/createQuiz/createQuizFABButton"

let quillModules = {
	markdownShortcuts: {
		debug: false,
	},
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

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function QuizComponent() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid, intake_name } = router.query

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
			<div className='bg-green-300 mx-1'>
				<div className='bg-red-300'>Create Quiz</div>
			</div>
			<FABButton />
		</Layout>
	)
}

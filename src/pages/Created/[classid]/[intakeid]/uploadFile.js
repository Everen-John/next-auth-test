import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"

import * as yup from "yup"
import Uppy from "@uppy/core"
import XHRUpload from "@uppy/xhr-upload"
import Form from "@uppy/form"
import { Dashboard, FileInput, useUppy } from "@uppy/react"
import ThumbnailGenerator from "@uppy/thumbnail-generator"
import Image from "next/image"

import "@uppy/core/dist/style.css"
import "@uppy/drag-drop/dist/style.css"
import "@uppy/core/dist/style.css"
import "@uppy/dashboard/dist/style.css"

import Layout from "../../../../components/master/layout"
import DatePicker from "react-datepicker"

const useUppyFunc = () => {
	let uppy = new Uppy({
		meta: { type: "media" },
		restrictions: {
			maxNumberOfFiles: 1,
			maxFileSize: 1048576 * 24,
			allowedFileTypes: [".jpg", ".jpeg", ".png", ".docx", ".doc", ".pdf"],
		},
	})

	uppy.use(XHRUpload, {
		endpoint: "/api/classCreatedData/uploadFile",
		fieldName: "media",
		formData: true,
	})

	uppy.use(ThumbnailGenerator, {
		thumbnailWidth: 200,
		waitForThumbnailsBeforeUpload: false,
	})

	uppy.on("thumbnail:generated", (file, preview) => {
		console.log(file.name, preview)
	})

	uppy.on("complete", (result) => {
		// const url = result.successful[0].uploadURL
		console.log("successful upload", result)
	})

	uppy.on("error", (error) => {
		console.error(error.stack)
	})

	return uppy
}

let fileUploadSchema = yup.object().shape({
	title: yup.string().required(),
	description: yup.string().required(),
	publish_time: yup.date().required(),
	file_deadline: yup.date().required(),
	in_intake_oID: yup.string().required(),
	files: yup.array().min(1).required(),
})

export default function UploadFile() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid, intake_name } = router.query
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		publish_time: new Date(),
		file_deadline: new Date(),
		in_intake_oID: intakeid,
		files: [],
	})
	const [fileForForm, setFileForForm] = useState()
	const [uploadButtonActive, setUploadButtonActive] = useState(false)
	const uppy = useUppy(useUppyFunc)

	useEffect(() => {
		setFormData({
			...formData,
			in_intake_oID: intakeid,
		})
	}, [intakeid])
	useEffect(() => {
		uppy.use(Form, {
			target: "form",
			resultName: "uppyResult",
			getMetaFromForm: true,
			addResultToForm: true,
			multipleResults: false,
			submitOnSuccess: false,
			triggerUploadOnSubmit: false,
		})

		uppy.on("file-added", (file) => {
			console.log("file-Added Form Data:", formData)
			setFileForForm(uppy.getFiles())
		})
		uppy.on("file-removed", (file) => {
			setFileForForm(uppy.getFiles())
		})

		return () => {
			uppy.close()
		}
	}, [])

	useEffect(async () => {
		console.log(formData)
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

	useEffect(async () => {
		setFormData({
			...formData,
			files: fileForForm,
		})
	}, [fileForForm])

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
			<div className='bg-green-700 m-2 '>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						// console.log(uppy.getFiles())
						uppy.upload()
					}}
				>
					<div className='flex flex-col items-center p-4'>
						<input
							className='mt-2 mb-1 w-full mx-2 text-xs h-10 border rounded-lg p-1'
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
						<div className=' mb-1 mx-2 text-xs h-10 w-full z-9999'>
							<DatePicker
								className='border rounded-lg p-1 w-full'
								name='publish_time'
								selected={formData.publish_time}
								dateFormat='dd/MM/yyyy h:mm aa'
								onChange={(date) =>
									setFormData({
										...formData,
										publish_time: new Date(date),
									})
								}
							/>
						</div>

						<input
							type='hidden'
							name='file_deadline'
							value={formData.file_deadline}
						/>
						<input
							type='hidden'
							name='in_intake_oID'
							value={formData.in_intake_oID}
						/>
						<Dashboard
							className='mb-1 mx-2 text-xs'
							id='upload'
							inline={true}
							uppy={uppy}
							locale={{
								strings: {
									dropHereOr: "Drop here or %{browse}",
									browse: "browse",
								},
							}}
							height={200}
							width={300}
							hideUploadButton={true}
							hideCancelButton={true}
							hideProgressAfterFinish={true}
						/>

						<button
							type='submit'
							disabled={uploadButtonActive ? false : true}
							className={`${
								uploadButtonActive
									? "bg-green-600 text-white font-bold transition-opacity shadow-lg border border-green-900 "
									: "bg-green-900 bg-opacity-50 text-opacity-50 text-gray-50 scale-50"
							} mt-4 mb-1 h-8 w-16 text-xs rounded-lg p-1`}
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</Layout>
	)
}

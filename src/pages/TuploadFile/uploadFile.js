import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

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

import Layout from "../../components/master/layout"
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
		endpoint: "/api/upload",
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
		const url = result.successful[0].uploadURL
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

export default function uploadFile() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid } = router.query
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		publish_time: new Date(),
		file_deadline: new Date(),
		in_intake_oID: "INTAKEIDVALUE",
		files: [],
	})
	const [fileForForm, setFileForForm] = useState()
	const [uploadButtonActive, setUploadButtonActive] = useState(false)
	const uppy = useUppy(useUppyFunc)

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
			<form
				onSubmit={(e) => {
					e.preventDefault()
					// console.log(uppy.getFiles())
					uppy.upload()
				}}
			>
				<input
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
				<input
					type='textarea'
					required={true}
					placeholder='Give the upload a description...'
					name='description'
					maxLength={50}
					onChange={(e) => {
						setFormData({
							...formData,
							description: e.target.value,
						})
					}}
				/>
				<DatePicker
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
					width={200}
					hideUploadButton={!uploadButtonActive}
					theme='dark'
				/>
				<button
					type='submit'
					disabled={uploadButtonActive ? false : true}
					className={`${uploadButtonActive ? "bg-white" : "bg-gray-700"}`}
				>
					Submit
				</button>
			</form>
		</Layout>
	)
}

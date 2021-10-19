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

	return (
		<Layout session={session}>
			<div className='bg-green-200'>
				<form method='post' action='api/upload2' encType='multipart/form-data'>
					<input type='text' placeholder='upload name...' />
					<input name='media' type='file' />
					<button type='submit' value='submit' className='bg-green-700'>
						Submit Form
					</button>
				</form>
			</div>
		</Layout>
	)
}

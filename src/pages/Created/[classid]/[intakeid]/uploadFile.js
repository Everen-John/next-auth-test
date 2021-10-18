import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

import Uppy from "@uppy/core"
import XHRUpload from "@uppy/xhr-upload"
import Form from "@uppy/form"
import { DragDrop, Dashboard } from "@uppy/react"
import ThumbnailGenerator from "@uppy/thumbnail-generator"
import Image from "next/image"

import "@uppy/core/dist/style.css"
import "@uppy/drag-drop/dist/style.css"
import "@uppy/core/dist/style.css"
import "@uppy/dashboard/dist/style.css"

import Layout from "../../../../components/master/layout"

const uppy = new Uppy({
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

export default function uploadFile() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { classid, intakeid } = router.query

	return (
		<Layout session={session}>
			<div className='text-white'>intakeid: {intakeid}</div>
			<div className='text-white'>classid: {classid}</div>

			<div>
				<Dashboard
					uppy={uppy}
					locale={{
						strings: {
							dropHereOr: "Drop here or %{browse}",
							browse: "browse",
						},
					}}
				/>
			</div>
		</Layout>
	)
}

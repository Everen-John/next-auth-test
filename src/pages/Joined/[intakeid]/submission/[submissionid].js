import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
import * as yup from "yup"
import dynamic from "next/dynamic"
import Layout from "../../../../components/master/layout"

import Uppy from "@uppy/core"
import XHRUpload from "@uppy/xhr-upload"
import Form from "@uppy/form"
import { Dashboard, FileInput, useUppy } from "@uppy/react"
import ThumbnailGenerator from "@uppy/thumbnail-generator"
import { ObjectId } from "bson"

import { InboxInIcon } from "@heroicons/react/outline"
// const submissionSchema

let submit_Schema = yup.object().shape({
	user_oID: yup.string().required(),
	file: yup.array().min(1).required(),
	submission_oID: yup.string().required(),
	intake_oID: yup.string().required(),
	user_name: yup.string().required(),
	namingConvention: yup.string().required(),
})

const useUppyFunc = () => {
	let uppy = new Uppy({
		meta: { type: "media" },
		// restrictions: {
		// 	maxNumberOfFiles: 1,
		// 	maxFileSize: submissionData.maxFileSize,
		// 	allowedFileTypes: submissionData.fileFormats,
		// },
	})

	uppy.use(XHRUpload, {
		endpoint: "/api/classJoinedData/submitFile",
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

export default function SubmissionId() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const { intakeid, submissionid, intake_name } = router.query
	const [loading, setLoading] = useState(true)
	const [submissionData, setSubmissionData] = useState()
	const [formData, setFormData] = useState()
	const [fileForForm, setFileForForm] = useState()
	const [uploadButtonActive, setUploadButtonActive] = useState(false)
	let uppy = useUppy(useUppyFunc)

	const loadPage = async () => {
		return new Promise(async (resolve, reject) => {
			console.log("Load Page!")
			let submissionData = await getSubmissionData()
			resolve(submissionData)
		})
			.then((submissionData) => {
				console.log("submissionData", submissionData)
				initializeUppy(submissionData)
				setSubmissionData(submissionData)
				return submissionData
			})
			.then((submissionData) => {
				setFormData({
					user_oID: ObjectId(session.user.id),
					intake_oID: ObjectId(intakeid),
					submission_oID: ObjectId(submissionid),
					user_name: session.user.name,
					namingConvention: JSON.stringify(submissionData.namingConvention),
				})
			})
			.then(() => {
				setLoading(false)
			})
	}
	const getSubmissionData = async () => {
		console.log("Ran getSubmission")
		if (status === "authenticated") {
			try {
				let res = await fetch("/api/classJoinedData/getSubmissionData", {
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
						userid: session.user.id,
						submissionid: submissionid,
						intakeid: intakeid,
					}), // body data type must match "Content-Type" header
				})
					.then((res) => res.json())
					.catch((e) => console.log(e))
				return res
			} catch (e) {
				console.log(e)
			}
		}
	}

	const initializeUppy = (submissionData) => {
		console.log(submissionData)
		uppy.setOptions({
			restrictions: {
				maxNumberOfFiles:
					"maxNumberOfFiles" in submissionData
						? submissionData.maxNumberOfFiles
						: 1,
				maxFileSize: submissionData.maxFileSize,
				allowedFileTypes: submissionData.fileFormats,
			},
		})

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
	}

	useEffect(async () => {
		console.log(Object.keys(router.query).length)
		//TODO: Authentication code here if not NextJS 12.
		if (Object.keys(router.query).length && status === "authenticated") {
			console.log("router Query Activated")
			await loadPage()
		}
	}, [router.query, status])

	useEffect(() => {
		setFormData({
			...formData,
			file: fileForForm,
		})
	}, [fileForForm])

	useEffect(() => {
		console.log("formData", formData)
		submit_Schema.isValid(formData).then((valid) => {
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

	return (
		<Layout session={session}>
			<Head>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<meta charSet='utf-8' />
				<title>{intake_name} | File Submission</title>
			</Head>
			<div className='m-2 text-xs text-white'>
				<Link href='/'>
					<a className='text-green-400 mx-2'>Home</a>
				</Link>
				{" > "}
				<Link href={`/Joined/${intakeid}`}>
					<a className='text-green-400 mx-2 '>{intake_name}</a>
				</Link>
				<section>
					<form
						onSubmit={(e) => {
							e.preventDefault()
							// console.log(uppy.getFiles())
							uppy.upload()
						}}
					>
						{loading ? (
							<div className='flex justify-center m-10'>
								<Image
									src='/Loaders/tail-spin.svg'
									width={100}
									height={100}
									alt='spinner'
								/>
							</div>
						) : (
							<div>
								<div className='bg-gray-800 m-2 px-3 py-3 rounded-md flex shadow-xl'>
									<InboxInIcon className='w-10 h-auto inline-block mr-2 text-green-400' />
									<div className='inline-block text-green-400 text-xl self-center '>
										{submissionData.submission_Title}
									</div>
								</div>
								<div className='bg-gray-100 p-2 m-2 text-black'>
									<div>{submissionData.submission_description}</div>
									<div>submission begins: {submissionData.publish_time}</div>
									<div>submission ends: {submissionData.deadline}</div>
									<div className='mb-3'>
										File formats:
										{submissionData.fileFormats.map((item, key) => {
											return (
												<div
													className='inline-block bg-white mr-1 px-1'
													key={key}
												>
													{" "}
													{item}
												</div>
											)
										})}
									</div>
									<input
										type='text'
										name='user_oID'
										value={session.user.id}
										hidden
									/>
									<input
										type='text'
										name='submission_oID'
										value={submissionid}
										hidden
									/>
									<input
										type='text'
										name='intake_oID'
										value={intakeid}
										hidden
									/>
									<input
										name='namingConvention'
										value={JSON.stringify(submissionData.namingConvention)}
										hidden
									/>
									<input name='user_name' value={session.user.name} hidden />

									<div className='flex justify-center min-w-full min-h-full '>
										<Dashboard
											className='mb-1 mx-2 text-xs min-w-full min-h-full'
											id='upload'
											inline={true}
											uppy={uppy}
											locale={{
												strings: {
													dropHereOr: "Drop here or %{browse}",
													browse: "browse",
												},
											}}
											width='100%'
											height='100%'
											hideUploadButton={true}
											hideCancelButton={true}
											hideProgressAfterFinish={true}
											disabled={
												!(
													new Date() > new Date(submissionData.publish_time) &&
													new Date() < new Date(submissionData.deadline)
												)
											}
										/>
									</div>
								</div>
								<div className='flex justify-end m-2'>
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
							</div>
						)}
					</form>
				</section>
			</div>
		</Layout>
	)
}

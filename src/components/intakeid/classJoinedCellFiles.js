import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "@heroicons/react/outline"
import { DocumentDownloadIcon } from "@heroicons/react/outline"
import { useRef, useState, useEffect } from "react"

export default function ClassJoinedCellFile({ weekItem }) {
	let anchorRef = useRef()
	let deadline = new Date(weekItem.filesDatas.file_deadline)
	let deadlineDate = deadline.toLocaleDateString("en-GB")
	let deadlineTime = deadline.toLocaleTimeString("en-GB", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	})
	let publish = new Date(weekItem.filesDatas.publish_time)
	let publishDate = publish.toLocaleDateString("en-GB")
	let publishTime = publish.toLocaleTimeString("en-GB", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	})

	const downloadFile = async () => {
		const anchorElement = anchorRef.current
		anchorElement.setAttribute("href", weekItem.filesDatas.file_location)
		anchorElement.setAttribute("download", "")
		return new Promise((resolve, reject) => {
			resolve(anchorElement.click())
		}).then((value) => {
			anchorElement.setAttribute("href", "")
			anchorElement.setAttribute("download", "")
		})
	}
	return (
		<div className='bg-gray-200 p-2 m-2 rounded-md' onClick={downloadFile}>
			<div className='text-3xs'>
				published for: {publishDate} {publishTime}
			</div>
			<div className='flex flex-row'>
				<div className='p-1 w-28 min-w-1/8 max-w-1/8'>
					{/* <Image src='/053-file.svg' width={28} height={28} /> */}
					<DocumentDownloadIcon className='h-7 w-7' />
				</div>

				<div className='p-1 break-words min-w-7/8 '>
					<div
						className={
							"text-xs font-medium rounded-md " + weekItem.filesDatas.bgcolor
								? weekItem.filesDatas.bgcolor
								: null
						}
					>
						{weekItem.filesDatas.file_title}
					</div>
					<div className='text-2xs'>
						{/* Deadline: {deadlineDate} {deadlineTime} */}
					</div>
					<p className='text-xs'>{weekItem.filesDatas.file_description} </p>
				</div>
			</div>
			<a ref={anchorRef}></a>
		</div>
	)
}

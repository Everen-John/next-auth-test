import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "@heroicons/react/outline"
import { DocumentDownloadIcon, InboxInIcon } from "@heroicons/react/outline"
import { useRef, useState, useEffect } from "react"

export default function ClassCreatedCellSubmission({ weekItem, classid }) {
	let anchorRef = useRef()
	let deadline = new Date(weekItem.submissionDatas.deadline)
	let deadlineDate = deadline.toLocaleDateString("en-GB")
	let deadlineTime = deadline.toLocaleTimeString("en-GB", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	})
	let publish = new Date(weekItem.submissionDatas.publish_time)
	let publishDate = publish.toLocaleDateString("en-GB")
	let publishTime = publish.toLocaleTimeString("en-GB", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	})
	return (
		<div className='bg-gray-200 p-2 m-2 rounded-md'>
			<Link
				href={`${classid}/${
					weekItem.submissionDatas.in_intake_oID
				}/submission/${
					weekItem.submissionDatas._id
				}?intake_name=${localStorage.getItem(
					`${weekItem.submissionDatas.in_intake_oID}name`
				)}`}
			>
				<div>
					<div className='text-3xs'>
						published on: {publishDate} {publishTime}
					</div>
					<div className='flex flex-row'>
						<div className='p-1 w-28 min-w-1/8 max-w-1/8'>
							{/* <Image src='/053-file.svg' width={28} height={28} /> */}
							<InboxInIcon className='h-7 w-7' />
						</div>

						<div className='p-1 break-words min-w-7/8 '>
							<div className={"text-xs font-medium rounded-md "}>
								{weekItem.submissionDatas.submission_Title}
							</div>
							<div className='text-2xs'>
								{/* Deadline: {deadlineDate} {deadlineTime} */}
							</div>
							<p className='text-xs'>
								{weekItem.submissionDatas.submission_description}{" "}
							</p>
						</div>
					</div>
				</div>
			</Link>
		</div>
	)
}

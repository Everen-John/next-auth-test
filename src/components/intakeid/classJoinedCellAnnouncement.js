import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "@heroicons/react/outline"

export default function ClassJoinedCellAnnouncement({ weekItem }) {
	let deadline = new Date(weekItem.announcementDatas.announcement_deadline)
	let deadlineDate = deadline.toLocaleDateString("en-GB")
	let deadlineTime = deadline.toLocaleTimeString("en-GB", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	})
	let publish = new Date(weekItem.announcementDatas.publish_time)
	let publishDate = publish.toLocaleDateString("en-GB")
	let publishTime = publish.toLocaleTimeString("en-GB", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	})
	return (
		<div className='bg-gray-200 p-2 m-2 rounded-md'>
			<div className='text-3xs'>
				published on: {publishDate} {publishTime}
			</div>
			<div className='flex flex-row'>
				<div className='p-1 w-28 min-w-1/8 max-w-1/8'>
					<Image src='/076-megaphone.svg' width={28} height={28} />
				</div>

				<div className='p-1 break-words min-w-7/8 '>
					<div
						className={
							"text-xs font-medium p-1 rounded-md " +
							weekItem.announcementDatas.bgcolor
						}
					>
						{weekItem.announcementDatas.announcement_Title}
					</div>
					<div className='text-2xs'>
						{/* Deadline: {deadlineDate} {deadlineTime} */}
					</div>
					<p className='text-xs'>
						{weekItem.announcementDatas.announcement_description}
					</p>
				</div>
			</div>
		</div>
	)
}

import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { AnnotationIcon } from "@heroicons/react/outline"

export default function ClassJoinedCellContent({ weekItem }) {
	let deadline = new Date(weekItem.contentDatas.deadline)
	let deadlineDate = deadline.toLocaleDateString("en-GB")
	let deadlineTime = deadline.toLocaleTimeString("en-GB", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	})
	let publish = new Date(weekItem.contentDatas.publish_time)
	let publishDate = publish.toLocaleDateString("en-GB")
	let publishTime = publish.toLocaleTimeString("en-GB", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	})
	return (
		<Link
			href={`./${weekItem.contentDatas.in_intake_oID}/content/${
				weekItem.contentDatas._id
			}?intake_name=${localStorage.getItem(
				`${weekItem.contentDatas.in_intake_oID}name`
			)}`}
		>
			<div className='bg-gray-200 p-2 m-2 rounded-md'>
				<div className='text-3xs'>
					published for: {publishDate} {publishTime}
				</div>
				<div className='flex flex-row'>
					<div className='p-1 w-28 min-w-1/8 max-w-1/8'>
						<AnnotationIcon className='h-7 w-7' />
					</div>

					<div className='p-1 break-words min-w-7/8 '>
						<div
							className={
								"text-xs font-medium rounded-md " +
								weekItem.contentDatas.bgcolor
							}
						>
							{weekItem.contentDatas.title}
						</div>
						<div className='text-2xs'>
							{/* Deadline: {deadlineDate} {deadlineTime} */}
						</div>
						<p className='text-xs'>{weekItem.contentDatas.description} </p>
					</div>
				</div>
			</div>
		</Link>
	)
}

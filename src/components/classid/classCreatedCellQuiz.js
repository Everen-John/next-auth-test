import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "@heroicons/react/outline"
import { AcademicCapIcon } from "@heroicons/react/outline"

export default function ClassCreatedCellQuiz({ weekItem, classid, intakeid }) {
	let deadline = new Date(weekItem.quizDatas.quiz_deadline)
	let deadlineDate = deadline.toLocaleDateString("en-GB")
	let deadlineTime = deadline.toLocaleTimeString("en-GB", {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	})
	let publish = new Date(weekItem.quizDatas.publish_time)
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
					weekItem.quizDatas.in_intake_oID
				}/quizDashboard?intake_name=${localStorage.getItem(
					`${weekItem.quizDatas.in_intake_oID}name`
				)}&quizid=${weekItem.quizDatas._id}`}
			>
				<div>
					<div className='text-3xs'>
						published on: {publishDate} {publishTime}
					</div>
					<div className='flex flex-row'>
						<div className='p-1 w-28 min-w-1/8 max-w-1/8'>
							{/* <Image src='/053-file.svg' width={28} height={28} /> */}
							<AcademicCapIcon className='h-7 w-7' />
						</div>

						<div className='p-1 break-words min-w-7/8 '>
							<div
								className={
									"text-xs font-medium rounded-md " + weekItem.quizDatas.bgcolor
										? weekItem.quizDatas.bgcolor
										: null
								}
							>
								{weekItem.quizDatas.title}
							</div>
							<div className='text-2xs'>
								{/* Deadline: {deadlineDate} {deadlineTime} */}
							</div>
							<p className='text-xs'>{weekItem.quizDatas.description} </p>
						</div>
					</div>
				</div>
			</Link>
		</div>
	)
}

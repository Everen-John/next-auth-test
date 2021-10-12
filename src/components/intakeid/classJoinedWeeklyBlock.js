import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import ClassJoinedCellAnnouncement from "./classJoinedCellAnnouncement"
import ClassJoinedCellContent from "./classJoinedCellContent"
import ClassJoinedCellFile from "./classJoinedCellFiles"
import ClassJoinedCellQuiz from "./classJoinedCellQuiz"

export default function ClassJoinedWeeklyBlock({ yearedData, setFolded }) {
	let firstDayOfWeek = new Date(yearedData.firstDayOfWeek).toLocaleDateString(
		"en-GB"
	)
	let lastDayOfWeek = new Date(yearedData.lastDayOfWeek).toLocaleDateString(
		"en-GB"
	)
	return (
		<div className='border border-gray-500 bg-white rounded-md m-2 shadow-md'>
			<div className='text-xs border rounded-t-md bg-green-600 pl-2 pb-1 text-white'>
				{firstDayOfWeek} to {lastDayOfWeek}
			</div>
			<div>
				<div className='pl-2 text-3xs'>Week {yearedData.weekNumber}</div>
				{yearedData.weekItems.map((weekItem, key) => {
					if (weekItem.type === "content")
						return <ClassJoinedCellContent weekItem={weekItem} key={key} />
					else if (weekItem.type === "announcement")
						return <ClassJoinedCellAnnouncement weekItem={weekItem} key={key} />
					else if (weekItem.type === "quiz")
						return <ClassJoinedCellQuiz weekItem={weekItem} key={key} />
					else if (weekItem.type === "files")
						return <ClassJoinedCellFiles weekItem={weekItem} key={key} />
				})}
			</div>
		</div>
	)
}

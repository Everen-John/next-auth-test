import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "@heroicons/react/outline"

import ClassJoinedWeeklyBlock from "./classJoinedWeeklyBlock"
import ClassJoinedYearlyBlock from "./classJoinedYearlyBlock"

export default function ClassJoinedContentBlock({ intakeJoined }) {
	return (
		<div className='bg-gray-800 p-1'>
			<div className='p-2 mb-4 mt-1 shadow-md bg-gray-900 rounded-lg flex flex-row'>
				<BookOpenIcon className='h-8 w-8 inline self-center text-green-400 mr-2 drop-shadow-md flex-grow-0 min-w-8' />
				<div className='inline truncate'>
					<h1 className='text-xl text-green-400'>
						{intakeJoined._id.class_name}
					</h1>
					<h3 className='text-xs text-green-400'>
						{intakeJoined._id.intake_name}
					</h3>
				</div>
			</div>

			{intakeJoined.yearlyItems.map((yearlyItem, key) => {
				return <ClassJoinedYearlyBlock key={key} yearlyItem={yearlyItem} />
			})}
		</div>
	)
}

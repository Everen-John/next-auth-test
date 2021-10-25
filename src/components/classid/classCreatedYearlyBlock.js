import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { ChevronDownIcon } from "@heroicons/react/solid"
import { ChevronUpIcon } from "@heroicons/react/solid"
import { useState } from "react"

import ClassCreatedWeeklyBlock from "./classCreatedWeeklyBlock"

export default function ClassCreatedYearlyBlock({ yearlyItem, classid }) {
	let today = new Date()
	let itemYearBeginning = new Date(yearlyItem.year, 0, 1)
	let itemYearEnding = new Date(yearlyItem.year, 11, 1)

	const [folded, setFolded] = useState(
		!(today >= itemYearBeginning && today <= itemYearEnding)
	)
	return (
		<div className='bg-gray-100 mb-2 rounded-lg p-1 '>
			<div className='flex flex-row'>
				<div className=' m-auto border-b-2 border-black border-dashed flex-grow-0 w-4'></div>
				<div className=' text-xl text-black '>{yearlyItem.year}</div>
				<div className=' m-auto border-b-2 border-black border-dashed flex-grow'></div>
				{folded ? (
					<ChevronDownIcon
						className='w-6 h-6 self-center'
						onClick={() => setFolded(false)}
					/>
				) : (
					<ChevronUpIcon
						className='w-6 h-6 self-center'
						onClick={() => setFolded(true)}
					/>
				)}
			</div>

			{folded
				? null
				: yearlyItem.yearedData.map((yearedData, key) => {
						return (
							<ClassCreatedWeeklyBlock
								yearedData={yearedData}
								key={key}
								classid={classid}
							/>
						)
				  })}
			{}
		</div>
	)
}

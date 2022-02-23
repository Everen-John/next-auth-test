import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useEffect, cloneElement } from "react"

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid"

export default function CalendarBlock({
	session,
	loading,
	setLoading,
	thisDate,
	setthisDate,
	thisDateDatas,
	setthisDateDatas,
	changeMonth,
	getSessionAndDate,
}) {
	return (
		<div className='mb-2'>
			<div className='calendarNavibar bg-green-600 flex flex-row'>
				{loading ? (
					<div className='self-center pl-2'>
						<Image src='/Loaders/oval.svg' width={16} height={16} />
					</div>
				) : null}

				<h2 className='text-sm  p-1 text-white flex-grow'>
					{thisDateDatas.monthYearName}
				</h2>
				<div
					id='btn_arrow_left'
					className='self-center cursor-pointer'
					onClick={changeMonth}
				>
					<ChevronLeftIcon className='h-8 w-8 text-white hover:text-green-300' />
				</div>

				<div
					id='btn_arrow_right'
					className='self-center cursor-pointer'
					onClick={changeMonth}
				>
					<ChevronRightIcon className='h-8 w-8 text-white hover:text-green-300' />
				</div>
			</div>
			<div className='grid grid-cols-7 bg-gray-100'>
				<div className='text-2xs bg-white border-b-2'>Mon</div>
				<div className='text-2xs bg-white border-b-2'>Tue</div>
				<div className='text-2xs bg-white border-b-2'>Wed</div>
				<div className='text-2xs bg-white border-b-2'>Thu</div>
				<div className='text-2xs bg-white border-b-2'>Fri</div>
				<div className='text-2xs bg-white border-b-2'>Sat</div>
				<div className='text-2xs bg-white border-b-2'>Sun</div>
				{thisDateDatas.CalendarCellArray
					? thisDateDatas.CalendarCellArray.map((item, key) =>
							cloneElement(item, (key = { key }))
					  )
					: null}
			</div>
		</div>
	)
}

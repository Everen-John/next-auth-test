import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import useSWR from "swr"

import CalendarCell from "./calendarCell"
import { useState } from "react"
import { cloneElement } from "react"

export default function CalendarBlock({ session }) {
	const [thisDate, setthisDate] = useState(new Date())
	const [thisDateDatas, setthisDateDatas] = useState({})

	const [loading, setLoading] = useState(false)

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]

	const getDateData = async (res) => {
		let results = await JSON.parse(JSON.stringify(res))
		let res2 = JSON.parse(JSON.stringify(results))
		let today = new Date()
		let thisMonth = thisDate.getMonth()
		let thisYear = thisDate.getFullYear()

		let thisMonthData = new Date(thisYear, thisMonth + 1, 0)
		let thisMonthTotalDays = thisMonthData.getDate()
		let thisMonthFirstDay = new Date(thisYear, thisMonth, 1).getDay() - 1
		if (thisMonthFirstDay == -1) thisMonthFirstDay += 7

		let thisMonthName = monthNames[thisMonth]
		let monthYearName = thisMonthName + " " + thisYear

		let CalendarCell_Array_temp = []
		for (let j = 0; j < thisMonthFirstDay; j++) {
			CalendarCell_Array_temp.push(<div></div>)
		}
		for (let i = 0; i < thisMonthTotalDays; i++) {
			CalendarCell_Array_temp.push(
				<CalendarCell
					dayNum={i + 1}
					calendarDatas={{ thisMonth, thisYear, thisMonthName }}
					announcementDatas={
						results.length != 0
							? results[0]._id == i + 1
								? results.shift().announcements
								: null
							: null
					}
					isToday={
						thisMonth == today.getMonth() &&
						today.getDate() == i + 1 &&
						today.getFullYear() == thisYear
							? true
							: false
					}
				/>
			)
		}

		setthisDateDatas({
			thisMonth,
			thisYear,
			thisMonthData,
			thisMonthTotalDays,
			thisMonthFirstDay,
			thisMonthName,
			monthYearName,
			CalendarCellArray: CalendarCell_Array_temp,
		})
	}

	const changeMonth = (e) => {
		if (e.target.id == "arrow_left") {
			let newDate = new Date(thisDate.setMonth(thisDate.getMonth() - 1))
			setthisDate(newDate)
		} else if ((e.target.id = "arrow_right")) {
			let newDate = new Date(thisDate.setMonth(thisDate.getMonth() + 1))
			setthisDate(newDate)
		}
	}

	const getSessionAndDate = async () => {
		if (session) {
			setLoading(true)
			let res = await fetch("api/HomePage/getHomePageData", {
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
					month: thisDate.getMonth() + 1,
					user: session.user.id,
				}), // body data type must match "Content-Type" header
			}).then((res) => res.json())
			// setUserCalendarData(res)
			getDateData(res)
		} else {
		}
		setLoading(false)
	}

	useEffect(() => {
		getSessionAndDate()
	}, [session, thisDate])

	return (
		<div>
			<div>
				<div className='calendarNavibar bg-green-600 flex flex-row '>
					{loading ? (
						<div className='self-center pl-2'>
							<Image src='/Loaders/oval.svg' width={16} height={16} />
						</div>
					) : null}

					<h2 className='text-sm  p-1 text-white flex-grow'>
						{thisDateDatas.monthYearName}
					</h2>
					<div className='self-center' onClick={changeMonth}>
						<Image
							id='arrow_left'
							src='/arrow-left.svg'
							width={28}
							height={28}
						/>
					</div>

					<div className='self-center' onClick={changeMonth}>
						<Image
							id='arrow_right'
							src='/arrow-right.svg'
							width={28}
							height={28}
						/>
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
						? thisDateDatas.CalendarCellArray.map((item, key) => {
								return item
						  })
						: null}
				</div>
			</div>
		</div>
	)
}

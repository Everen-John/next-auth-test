// import { loadGetInitialProps } from "next/dist/shared/lib/utils"
// import Head from "next/head"
// import Image from "next/image"
// import Link from "next/link"
// import { useEffect } from "react"
// import useSWR from "swr"

// import CalendarCell from "./calendarCell"
// import { useState } from "react"
// import { cloneElement } from "react"

// const fetcher = async (url, thisDate) => {
// 	return await fetch(url, {
// 		method: "POST", // *GET, POST, PUT, DELETE, etc.
// 		mode: "cors", // no-cors, *cors, same-origin
// 		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
// 		credentials: "same-origin", // include, *same-origin, omit
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		redirect: "follow", // manual, *follow, error
// 		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
// 		body: JSON.stringify(thisDate.getMonth() + 1), // body data type must match "Content-Type" header
// 	}).then((res) => res.json())
// }

// export default function calendarBlock({ session }) {
// 	const [thisDate, setthisDate] = useState(new Date())
// 	const [thisDateDatas, setthisDateDatas] = useState({})
// 	let { data, error } = useSWR(
// 		["api/HomePage/getHomePageData", thisDate],
// 		fetcher
// 	)

// 	const monthNames = [
// 		"January",
// 		"February",
// 		"March",
// 		"April",
// 		"May",
// 		"June",
// 		"July",
// 		"August",
// 		"September",
// 		"October",
// 		"November",
// 		"December",
// 	]

// 	const getDateData = () => {
// 		let today = new Date()
// 		let thisMonth = thisDate.getMonth()
// 		let thisYear = thisDate.getFullYear()

// 		let thisMonthData = new Date(thisYear, thisMonth + 1, 0)
// 		let thisMonthTotalDays = thisMonthData.getDate()
// 		let thisMonthFirstDay = new Date(thisYear, thisMonth, 1).getDay() - 1
// 		if (thisMonthFirstDay == -1) thisMonthFirstDay += 7

// 		let thisMonthName = monthNames[thisMonth]
// 		let monthYearName = thisMonthName + " " + thisYear

// 		let CalendarCell_Array_temp = []
// 		for (let j = 0; j < thisMonthFirstDay; j++) {
// 			CalendarCell_Array_temp.push(<div></div>)
// 		}
// 		for (let i = 0; i < thisMonthTotalDays; i++) {
// 			CalendarCell_Array_temp.push(
// 				<CalendarCell
// 					dayNum={i + 1}
// 					calendarDatas={{ thisMonthName, thisYear }}
// 				/>
// 			)
// 		}

// 		setthisDateDatas({
// 			thisMonth,
// 			thisYear,
// 			thisMonthData,
// 			thisMonthTotalDays,
// 			thisMonthFirstDay,
// 			thisMonthName,
// 			monthYearName,
// 			CalendarCellArray: CalendarCell_Array_temp,
// 		})
// 	}

// 	const AddDataIntoCalendar = async () => {
// 		if (data) {
// 			console.log(data)
// 			let today = new Date()
// 			let thisMonth = thisDate.getMonth()
// 			let thisYear = thisDate.getFullYear()

// 			let thisMonthData = new Date(thisYear, thisMonth + 1, 0)
// 			let thisMonthTotalDays = thisMonthData.getDate()
// 			let thisMonthFirstDay = new Date(thisYear, thisMonth, 1).getDay() - 1
// 			if (thisMonthFirstDay == -1) thisMonthFirstDay += 7

// 			let thisMonthName = monthNames[thisMonth]
// 			let monthYearName = thisMonthName + " " + thisYear

// 			let CalendarCell_Array_temp = []
// 			for (let j = 0; j < thisMonthFirstDay; j++) {
// 				CalendarCell_Array_temp.push(<div></div>)
// 			}
// 			for (let i = 0; i < thisMonthTotalDays; i++) {
// 				CalendarCell_Array_temp.push(
// 					<CalendarCell
// 						dayNum={i + 1}
// 						calendarDatas={{ thisMonthName, thisYear }}
// 						announcementDatas={
// 							data[0]._id == i + 1 ? data.shift().announcements : null
// 						}
// 					/>
// 				)
// 			}
// 			setthisDateDatas({
// 				thisMonth,
// 				thisYear,
// 				thisMonthData,
// 				thisMonthTotalDays,
// 				thisMonthFirstDay,
// 				thisMonthName,
// 				monthYearName,
// 				CalendarCellArray: CalendarCell_Array_temp,
// 			})
// 		} else {
// 			console.log("No Data!")
// 		}
// 	}

// 	const changeMonth = (e) => {
// 		if (e.target.id == "arrow_left") {
// 			let newDate = new Date(thisDate.setMonth(thisDate.getMonth() - 1))
// 			setthisDate(newDate)
// 		} else if ((e.target.id = "arrow_right")) {
// 			let newDate = new Date(thisDate.setMonth(thisDate.getMonth() + 1))
// 			setthisDate(newDate)
// 		}
// 	}

// 	useEffect(() => {
// 		getDateData()
// 	}, [thisDate]) //Run getDateData the Moment thisDate is Instantiated.

// 	useEffect(() => {
// 		// setTimeout(1000)
// 		// AddDataIntoCalendar()
// 		console.log(data)
// 	}, [data]) //Run CloneComponents to inject properties into existing components

// 	return (
// 		<div>
// 			{error ? <h2>{error}</h2> : <h2>No error!</h2>}
// 			<div className='calendarNavibar bg-green-700 flex flex-row'>
// 				<h2 className='text-sm  p-1 text-white flex-grow'>
// 					{thisDateDatas.monthYearName}
// 				</h2>
// 				<div className='self-center' onClick={changeMonth}>
// 					<Image id='arrow_left' src='/arrow-left.svg' width={28} height={28} />
// 				</div>

// 				<div className='self-center' onClick={changeMonth}>
// 					<Image
// 						id='arrow_right'
// 						src='/arrow-right.svg'
// 						width={28}
// 						height={28}
// 					/>
// 				</div>
// 			</div>
// 			<div className='grid grid-cols-7'>
// 				<div className='text-xs'>Mon</div>
// 				<div className='text-xs'>Tue</div>
// 				<div className='text-xs'>Wed</div>
// 				<div className='text-xs'>Thu</div>
// 				<div className='text-xs'>Fri</div>
// 				<div className='text-xs'>Sat</div>
// 				<div className='text-xs'>Sun</div>
// 				{thisDateDatas.CalendarCellArray
// 					? thisDateDatas.CalendarCellArray.map((item, key) => {
// 							return item
// 					  })
// 					: null}
// 			</div>
// 		</div>
// 	)
// }

import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import useSWR from "swr"

import CalendarCell from "./calendarCell"
import { useState } from "react"
import { cloneElement } from "react"

const fetcher = async (url, thisDate) => {
	return await fetch(url, {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(thisDate.getMonth() + 1), // body data type must match "Content-Type" header
	}).then((res) => res.json())
}

export default function calendarBlock({ session }) {
	const [thisDate, setthisDate] = useState(new Date())
	const [thisDateDatas, setthisDateDatas] = useState({})
	const [userCalendarData, setUserCalendarData] = useState([])

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
		console.log("There")
		let results = await JSON.parse(JSON.stringify(res))

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
					calendarDatas={{ thisMonthName, thisYear }}
					announcementDatas={
						results.length != 0
							? results[0]._id == i + 1
								? results.shift().announcements
								: null
							: null
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

	useEffect(async () => {
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
			body: JSON.stringify(thisDate.getMonth() + 1), // body data type must match "Content-Type" header
		}).then((res) => res.json())
		console.log(res)
		// setUserCalendarData(res)
		getDateData(res)
	}, [thisDate])

	return (
		<div>
			<div className='calendarNavibar bg-green-700 flex flex-row'>
				<h2 className='text-sm  p-1 text-white flex-grow'>
					{thisDateDatas.monthYearName}
				</h2>
				<div className='self-center' onClick={changeMonth}>
					<Image id='arrow_left' src='/arrow-left.svg' width={28} height={28} />
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
			<div className='grid grid-cols-7'>
				<div className='text-xs'>Mon</div>
				<div className='text-xs'>Tue</div>
				<div className='text-xs'>Wed</div>
				<div className='text-xs'>Thu</div>
				<div className='text-xs'>Fri</div>
				<div className='text-xs'>Sat</div>
				<div className='text-xs'>Sun</div>
				{thisDateDatas.CalendarCellArray
					? thisDateDatas.CalendarCellArray.map((item, key) => {
							return item
					  })
					: null}
			</div>
		</div>
	)
}

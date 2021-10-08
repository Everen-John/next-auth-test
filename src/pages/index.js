import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

import Layout from "../components/master/layout"

import CalendarBlock from "../components/index/ClassesJoined/Calendar/calendarBlock"
import ClassesJoined from "../components/index/ClassesJoined/ClassesDisplay/classesJoinedBlock"
import CalendarCell from "../components/index/ClassesJoined/Calendar/calendarCell"

export default function HomePage({ client }) {
	//STATES////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	const { data: session } = useSession()
	const [calendarLoading, setcalendarLoading] = useState(false)
	const [thisDate, setthisDate] = useState(new Date())
	const [thisDateDatas, setthisDateDatas] = useState({})
	const [classesJoinedLoading, setclassesJoinedLoading] = useState(false)
	const [classesJoinedData, setclassesJoinedData] = useState()
	const [txtJoinIntake, settxtJoinIntake] = useState()

	//CONSTANTS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	const MONTHNAMES = [
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

	//FUNCTIONS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

		let thisMonthName = MONTHNAMES[thisMonth]
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
			setcalendarLoading(true)
			let res = await fetch("api/index/ClassesJoined/getHomePageCalendarData", {
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
			console.log(res)
			getDateData(res)
		} else {
		}
		setcalendarLoading(false)
	}

	const getClassesJoined = async () => {
		if (session) {
			setclassesJoinedLoading(true)
			let res = await fetch("api/index/ClassesJoined/getHomePageClassesData", {
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
					user: session.user.id,
				}), // body data type must match "Content-Type" header
			}).then((res) => res.json())
			console.log(res)
			setclassesJoinedData(res)
		} else {
		}
		setclassesJoinedLoading(false)
	}

	const joinIntake = async () => {
		if (txtJoinIntake) {
			let res = await fetch("api/index/ClassesJoined/joinIntake", {
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
					txtJoinIntake: txtJoinIntake,
					user: session.user.id,
				}), // body data type must match "Content-Type" header
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.joined == false) {
						window.alert(res.msg)
					} else if (res.joined == true) {
						window.alert(res.msg)
					}
					if (res.refresh) {
						location.reload()
					}
				})
				.catch((e) => console.log(e))
		} else {
			window.alert("Don't leave the field empty!")
		}
	}

	//EFFECTS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	useEffect(() => {
		getSessionAndDate()
	}, [session, thisDate])

	useEffect(() => {
		getClassesJoined()
	}, [session])

	return (
		<Layout session={session}>
			<CalendarBlock
				session={session}
				calendarLoading={calendarLoading}
				setcalendarLoading={setcalendarLoading}
				thisDate={thisDate}
				setthisDate={setthisDate}
				thisDateDatas={thisDateDatas}
				setthisDateDatas={setthisDateDatas}
				changeMonth={changeMonth}
				getSessionAndDate={getSessionAndDate}
			/>

			<ClassesJoined
				classesJoinedData={classesJoinedData}
				setclassesJoinedData={setclassesJoinedData}
				classesJoinedLoading={classesJoinedLoading}
				setclassesJoinedLoading={setclassesJoinedLoading}
				txtJoinIntake={txtJoinIntake}
				settxtJoinIntake={settxtJoinIntake}
				btnJoinIntake={joinIntake}
			/>
		</Layout>
	)
}

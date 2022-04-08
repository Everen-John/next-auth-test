import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { getSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"

import Layout from "../components/master/layout"

import CalendarBlock from "../components/index/ClassesJoined/Calendar/calendarBlock"
import ClassesJoined from "../components/index/ClassesJoined/ClassesDisplay/classesJoinedBlock"
import CalendarCell from "../components/index/ClassesJoined/Calendar/calendarCell"
import ClassesCreated from "../components/index/ClassesCreated/ClassesDisplay/ClassesCreatedBlock"
import autoprefixer from "autoprefixer"
import { useRouter } from "next/router"

export default function HomePage({}) {
	//STATES////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	const { data: session, status } = useSession()
	const [thisDate, setthisDate] = useState(new Date())

	const [calendarLoading, setCalendarLoading] = useState(false)
	const [thisDateJoinedDatas, setthisDateJoinedDatas] = useState({})
	const [classesJoinedData, setclassesJoinedData] = useState()
	const [classesCreatedData, setClassesCreatedData] = useState()

	const [txtJoinIntake, settxtJoinIntake] = useState()
	const router = useRouter()

	let dateForAPI = new Date(thisDate.getFullYear(), thisDate.getMonth(), 1)

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
	const changeMonth = (e) => {
		console.log("Ran Change Month")
		console.log(e.currentTarget.id)
		setCalendarLoading(true)
		if (e.currentTarget.id == "btn_arrow_left") {
			let newDate = new Date(thisDate.setMonth(thisDate.getMonth() - 1))
			setthisDate(newDate)
		} else if (e.currentTarget.id == "btn_arrow_right") {
			let newDate = new Date(thisDate.setMonth(thisDate.getMonth() + 1))
			setthisDate(newDate)
		}
		setCalendarLoading(false)
	}

	const getSessionAndDate = async () => {
		console.log("Ran getSessionAndDate")
		if (session) {
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
					month: dateForAPI.getMonth() + 1,
					year: dateForAPI.getFullYear(),
					user: session.user.id,
				}), // body data type must match "Content-Type" header
			}).then((res) => res.json())
			console.log("sessionAndDateData: ", res)
			getDateData(res)
		} else {
			console.log("No Session!")
		}
	}

	const getDateData = async (res) => {
		console.log("Ran getDateData")
		let results = await JSON.parse(JSON.stringify(res))
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

		setthisDateJoinedDatas({
			rawData: results,
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

	const getClassesJoined = async () => {
		console.log("Ran getClassesJoined")
		if (session) {
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
			console.log("GetClassesJoined Data", res)
			setclassesJoinedData(res)
		} else {
			console.log("No Session!")
		}
	}

	const joinIntake = async () => {
		console.log("Ran JoinIntake")
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
						router.reload()
					}
				})
				.catch((e) => console.log(e))
		} else {
			window.alert("Don't leave the field empty!")
		}
	}

	const getClassesCreatedData = async () => {
		console.log("Ran getClassesCreatedData")
		if (session) {
			let res = await fetch(
				"api/index/ClassesCreated/getHomePageClassesCreatedData",
				{
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
				}
			)
				.then((res) => res.json())
				.catch((e) => console.log(e))
			console.log("GetClassesCreated Data", res)
			setClassesCreatedData(res)
		} else {
			console.log("No Session!")
		}
	}

	//EFFECTS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	useEffect(async () => {
		if (status === "authenticated") {
			await getClassesJoined()
			await getClassesCreatedData()
		} else {
			console.log("awaiting authentication!")
		}
	}, [status === "authenticated"])

	useEffect(async () => {
		if (status === "authenticated") {
			console.log(thisDate)
			dateForAPI = new Date(thisDate.getFullYear(), thisDate.getMonth(), 1)
			console.log(dateForAPI)
			await getSessionAndDate()
		} else {
			console.log("awaiting authentication!")
		}
	}, [status === "authenticated", thisDate])

	//RETURN////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	return (
		<Layout session={session}>
			<div>
				{thisDateJoinedDatas ? (
					<CalendarBlock
						loading={calendarLoading}
						thisDate={thisDate}
						thisDateDatas={thisDateJoinedDatas}
						changeMonth={changeMonth}
					/>
				) : null}

				<ClassesJoined
					classesJoinedData={classesJoinedData}
					txtJoinIntake={txtJoinIntake}
					settxtJoinIntake={settxtJoinIntake}
					btnJoinIntake={joinIntake}
				/>
				<ClassesCreated
					classesCreatedData={classesCreatedData}
					// txtJoinIntake={txtJoinIntake}
					// settxtJoinIntake={settxtJoinIntake}
					// btnJoinIntake={joinIntake}
				/>
			</div>
		</Layout>
	)
}

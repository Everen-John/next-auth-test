import React, { useRef, useState, useEffect } from "react"
import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/solid"

const setDefaultAccordianForTheFirstTime = (classid, content) => {
	if (!localStorage.getItem(`classId${classid}lastPickedAccordianMenu`)) {
		localStorage.setItem(
			`classId${classid}lastPickedAccordianMenu`,
			JSON.stringify({
				intake_name: content[0].intake_name,
				intake_oID: content[0].intake_oID,
			})
		)
	} else {
		console.log(
			`classId${classid}lastPickedAccordianMenu :`,
			localStorage.getItem()
		)
	}
}

const setDefaultAccordianData = (newAccordianSelection) => {
	localStorage.setItem(
		`classId${newAccordianSelection.class_oID}lastPickedAccordianMenu`,
		JSON.stringify({
			intake_name: newAccordianSelection.intake_name,
			intake_oID: newAccordianSelection.intake_oID,
		})
	)
}
export default function Accordion({ title, content, classid }) {
	const [active, setActive] = useState(false)
	const [height, setHeight] = useState("0px")
	const [rotate, setRotate] = useState("transform duration-100 ease")
	const [selectedIntake, setSelectedIntake] = useState(
		JSON.parse(localStorage.getItem(`classId${classid}lastPickedAccordianMenu`))
	)

	const contentSpace = useRef(null)

	if (!selectedIntake) {
		setDefaultAccordianForTheFirstTime(classid)
	}

	function toggleAccordion() {
		setActive(!active)
	}

	const handleAccordianMenuClicked = (e) => {
		let AccordianMenuData = JSON.parse(e.target.value)
		console.log(AccordianMenuData)
		setSelectedIntake(AccordianMenuData)
		setDefaultAccordianData(AccordianMenuData)
		setActive(!active)
	}

	useEffect(() => {
		setHeight(!active ? "0px" : `${contentSpace.current.scrollHeight}px`)
		setRotate(
			!active
				? "transform duration-200 ease"
				: "transform duration-200 ease rotate-180"
		)
	}, [active])

	return (
		<div className='flex flex-col bg-gray-800 text-green-400 m-2 rounded-md truncate'>
			<button
				className='max-w-full pl-10 pr-10 py-2 box-border appearance-none cursor-pointer focus:outline-none flex items-center justify-between'
				onClick={toggleAccordion}
			>
				<p className='inline-block text-footnote light'>
					{selectedIntake.intake_name}
				</p>
				<ChevronDownIcon
					className={`${rotate} inline-block max-h-6 max-w-1/8 pr-2`}
				/>
			</button>
			<div
				ref={contentSpace}
				style={{ maxHeight: `${height}` }}
				className='overflow-auto transition-max-height duration-200 ease-in-out'
			>
				{content.map((item, key) => (
					<div className=' m-1 pt-1 pl-10 pr-10 pb-2 bg-gray-700' key={key}>
						<button
							value={JSON.stringify(item)}
							onClick={handleAccordianMenuClicked}
							className='min-w-full text-left'
						>
							{item.intake_name}
						</button>
					</div>
				))}
				<div className='m-1 pt-1 pl-10 pr-10 pb-2 bg-gray-700'>
					<button className='min-w-full text-left '>
						<PlusCircleIcon className='max-h-7 w-4 inline-block' />{" "}
						<div className='inline-block text-center'>Create a new Intake!</div>
					</button>
				</div>
			</div>
		</div>
	)
}

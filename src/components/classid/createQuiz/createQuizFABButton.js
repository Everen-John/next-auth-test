import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import { useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "@heroicons/react/outline"
import {
	PlusIcon,
	AcademicCapIcon,
	CloudUploadIcon,
	AnnotationIcon,
	ExclamationCircleIcon,
} from "@heroicons/react/outline"
import { XyzTransitionGroup } from "@animxyz/react"

export default function ClassCreatedFABButton({
	classid,
	intakeid,
	addNewFITBQuestion,
	addNewCheckboxQuestion,
	addNewRadioQuestion,
	addNewEssayQuestion,
}) {
	const [btnAddActive, setbtnAddActive] = useState(false)

	const handleAddQuiz = () => {
		setbtnAddActive(false)
	}
	const handleAddFile = () => {
		setbtnAddActive(false)
	}
	const handleAddContent = () => {
		setbtnAddActive(false)
	}
	const handleAddAnnouncement = () => {
		setbtnAddActive(false)
	}
	return (
		<div>
			<button
				onClick={() => setbtnAddActive(!btnAddActive)}
				className='p-5 w-16 h-16 right-4 bottom-8 bg-green-600 text-green-100 rounded-full hover:bg-green-700 active:shadow-lg mouse shadow transition ease-in duration-100 focus:outline-none fixed '
			>
				<PlusIcon />
			</button>
			<XyzTransitionGroup
				className='item-group'
				xyz='fade down-100% duration-2 '
			>
				{btnAddActive ? (
					<div
						className='fixed right-4 bottom-28 list-none float-right transition-opacity opacity-100 '
						onBlur={() => {
							setbtnAddActive(false)
						}}
					>
						<button
							onClick={() => {
								setbtnAddActive(false)
								addNewFITBQuestion()
							}}
							className='px-3 ml-auto mr-0 mb-1 list-item text-white w-auto h-10 bg-green-600 rounded-full hover:bg-green-700 active:shadow-lg mouse shadow focus:outline-none'
						>
							<div className='inline-block'>Fill in the Blanks - Objective</div>
						</button>

						<button
							onClick={() => {
								setbtnAddActive(false)
								addNewRadioQuestion()
							}}
							className='px-3 ml-auto mr-0 mb-1 list-item text-white w-auto h-10 bg-green-600 rounded-full hover:bg-green-700 active:shadow-lg mouse shadow focus:outline-none'
						>
							<div className='inline-block'>
								Multiple Choice (radio)- Objective
							</div>
						</button>
						<button
							onClick={() => {
								setbtnAddActive(false)
								addNewCheckboxQuestion()
							}}
							className='px-3 ml-auto mr-0 mb-1 list-item text-white w-auto h-10 bg-green-600 rounded-full hover:bg-green-700 active:shadow-lg mouse shadow focus:outline-none'
						>
							<div className='inline-block'>
								Multiple Choice (checkbox) - Objective
							</div>
						</button>
						<button
							onClick={() => {
								setbtnAddActive(false)
								addNewEssayQuestion()
							}}
							className='px-3 ml-auto mr-0 mb-1 list-item text-white w-auto h-10 bg-green-600 rounded-full hover:bg-green-700 active:shadow-lg mouse shadow focus:outline-none'
						>
							<div className='inline-block'>Essay - Subjective</div>
						</button>
					</div>
				) : null}
			</XyzTransitionGroup>
		</div>
	)
}

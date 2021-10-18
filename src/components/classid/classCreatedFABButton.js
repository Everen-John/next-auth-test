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

export default function ClassCreatedFABButton({ classid, intakeid }) {
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
							onClick={handleAddQuiz}
							className='px-3 ml-auto mr-0 mb-1 list-item text-white w-auto h-10 bg-green-600 rounded-full hover:bg-green-700 active:shadow-lg mouse shadow focus:outline-none'
						>
							<AcademicCapIcon className='max-h-10 w-6 mr-2 inline-block' />
							<div className='inline-block'>Quiz</div>
						</button>
						<Link href={`/Created/${classid}/${intakeid}/uploadFile`}>
							<button
								onClick={handleAddFile}
								className='px-3 ml-auto mr-0 mb-1 list-item text-white w-auto h-10 bg-green-600 rounded-full hover:bg-green-700 active:shadow-lg mouse shadow focus:outline-none'
							>
								<CloudUploadIcon className='max-h-10 w-5 mr-2 inline-block' />
								<div className='inline-block'>File</div>
							</button>
						</Link>
						<button
							onClick={handleAddContent}
							className='px-3 ml-auto mr-0 mb-1 list-item text-white w-auto h-10 bg-green-600 rounded-full hover:bg-green-700 active:shadow-lg mouse shadow  focus:outline-none'
						>
							<AnnotationIcon className='max-h-10 w-6 mr-2 inline-block' />
							<div className='inline-block'>Content</div>
						</button>
						<button
							onClick={handleAddAnnouncement}
							className='px-3 ml-auto mr-0 mb-1 list-item text-white w-auto h-10 bg-green-600 rounded-full hover:bg-green-700 active:shadow-lg mouse shadow focus:outline-none'
						>
							<ExclamationCircleIcon className='max-h-10 w-6 mr-2 inline-block' />
							<div className='inline-block'>Announcement</div>
						</button>
					</div>
				) : null}
			</XyzTransitionGroup>
		</div>
	)
}

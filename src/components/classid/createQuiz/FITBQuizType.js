import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
export default function FITBQuizType({
	quillModules,
	quillFormats,
	FITBData,
	index,
	quizDataChangeHandler,
}) {
	const FITBAnswersHandler = (key, value) => {
		let tempFITBAnswers = FITBData.fitb_answers
		tempFITBAnswers[key] = value
		let tempFITBData = { ...FITBData, fitb_answers: tempFITBAnswers }
		quizDataChangeHandler(tempFITBData, index)
	}

	const addAnotherAnswer = () => {
		let tempFITBAnswers = FITBData.fitb_answers
		tempFITBAnswers.push("")
		let tempFITBData = { ...FITBData, fitb_answers: tempFITBAnswers }
		quizDataChangeHandler(tempFITBData, index)
	}

	const removeAnswer = (key) => {
		let tempFITBAnswers = FITBData.fitb_answers
		tempFITBAnswers.splice(key, 1)
		if (tempFITBAnswers.length === 0) {
			tempFITBAnswers.push("")
		}
		let tempFITBData = { ...FITBData, fitb_answers: tempFITBAnswers }
		quizDataChangeHandler(tempFITBData, index)
	}

	return (
		<div className='bg-gray-200 m-3 overflow-visible p-3'>
			<div className='mb-6'>
				<p className='text-sm'>Question Text</p>
				<ReactQuill
					className='bg-white'
					modules={quillModules}
					formats={quillFormats}
					theme='snow'
					value={FITBData.question_text}
					onChange={(e) => {
						console.log(e)
						quizDataChangeHandler({ ...FITBData, question_text: e }, index)
					}}
				/>
			</div>

			<div>
				<p className='text-sm'>Answers</p>
				<div className='mb-2'>
					{FITBData.fitb_answers.map((item, key) => {
						console.log(item)
						return (
							<div className=''>
								<input
									type='text'
									value={item}
									onChange={(e) => FITBAnswersHandler(key, e.target.value)}
									key={key}
									className='border border-gray-300 border-solid'
								/>
								<button
									onClick={(e) => {
										removeAnswer(key)
									}}
								>
									<TrashIcon className=' w-5 text-gray-500 inline-block' />
								</button>
							</div>
						)
					})}
				</div>
			</div>
			<button
				className='bg-white border border-gray-300 px-4 py-2 text-sm rounded-md'
				onClick={() => {
					addAnotherAnswer()
				}}
			>
				<PlusCircleIcon className='h-5 w-auto inline-block mr-2' />
				<div className='inline-block'>Add Another Field</div>
			</button>
		</div>
	)
}

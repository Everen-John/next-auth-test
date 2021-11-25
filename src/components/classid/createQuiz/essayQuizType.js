import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { PlusCircleIcon, TrashIcon, XIcon } from "@heroicons/react/outline"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
export default function EssayQuizType({
	quillModules,
	quillFormats,
	essayData,
	index,
	quizDataChangeHandler,
	removeQuestion,
}) {
	// const radioValuesHandler = (key, value) => {
	// 	let tempRadioValues = essayData.radio_values
	// 	tempRadioValues[key] = value
	// 	let tempRadioData = { ...essayData, radio_values: tempRadioValues }
	// 	quizDataChangeHandler(tempRadioData, index)
	// }

	// const addAnotherValue = () => {
	// 	let tempRadioValues = essayData.radio_values
	// 	tempRadioValues.push("")
	// 	let tempRadioData = { ...essayData, radio_values: tempRadioValues }
	// 	quizDataChangeHandler(tempRadioData, index)
	// }

	// const removeValue = (key) => {
	// 	let tempRadioValues = essayData.radio_values
	// 	tempRadioValues.splice(key, 1)
	// 	if (tempRadioValues.length === 0) {
	// 		tempRadioValues.push("")
	// 	}
	// 	let tempRadioData = { ...essayData, radio_values: tempRadioValues }
	// 	quizDataChangeHandler(tempRadioData, index)
	// }

	// const selectAnswerHandler = (key) => {
	// 	let tempRadioData = { ...essayData, radio_answer: key }
	// 	quizDataChangeHandler(tempRadioData, index)
	// }

	return (
		<div className='bg-gray-200  mb-3 overflow-visible p-3'>
			<div className='flex justify-between'>
				<div className='text-sm text-gray-400 border border-gray-400 rounded-full h-5 w-5 flex items-center justify-center mr-2 p-1'>
					{index + 1}
				</div>
				<div>
					<XIcon
						className='h-5 w-5'
						onClick={(e) => {
							removeQuestion(index)
						}}
					/>
				</div>
			</div>
			<div className='mb-6 text-xl font-medium'>Essay</div>
			<div className='mb-6'>
				<p className='text-sm'>Question Text</p>
				<ReactQuill
					className='bg-white'
					modules={quillModules}
					formats={quillFormats}
					theme='snow'
					value={essayData.question_text}
					onChange={(e) => {
						console.log(e)
						quizDataChangeHandler({ ...essayData, question_text: e }, index)
					}}
				/>
			</div>
		</div>
	)
}

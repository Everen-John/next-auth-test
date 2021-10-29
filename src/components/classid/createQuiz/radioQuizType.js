import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { PlusCircleIcon, TrashIcon, XIcon } from "@heroicons/react/outline"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function RadioQuizType({
	quillModules,
	quillFormats,
	radioData,
	index,
	quizDataChangeHandler,
	removeQuestion,
}) {
	const radioValuesHandler = (key, value) => {
		let tempRadioValues = radioData.radio_values
		tempRadioValues[key] = value
		let tempRadioData = { ...radioData, radio_values: tempRadioValues }
		quizDataChangeHandler(tempRadioData, index)
	}

	const addAnotherValue = () => {
		let tempRadioValues = radioData.radio_values
		tempRadioValues.push("")
		let tempRadioData = { ...radioData, radio_values: tempRadioValues }
		quizDataChangeHandler(tempRadioData, index)
	}

	const removeValue = (key) => {
		let tempRadioValues = radioData.radio_values
		tempRadioValues.splice(key, 1)
		if (tempRadioValues.length <= 1) {
			tempRadioValues.push("")
		}
		let tempRadioData = { ...radioData, radio_values: tempRadioValues }
		quizDataChangeHandler(tempRadioData, index)
	}

	const selectAnswerHandler = (key) => {
		let tempRadioData = { ...radioData, radio_answer: key }
		quizDataChangeHandler(tempRadioData, index)
	}

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
			<div className='mb-6 text-xl font-medium'>Multiple Choice (Radio)</div>
			<div className='mb-3'>
				<p className='text-sm'>Question Text</p>
				<ReactQuill
					className='bg-white'
					modules={quillModules}
					formats={quillFormats}
					theme='snow'
					value={radioData.question_text}
					onChange={(e) => {
						console.log(e)
						quizDataChangeHandler({ ...radioData, question_text: e }, index)
					}}
				/>
			</div>

			<div>
				<p className='text-sm'>Answers (choose the correct answer)</p>
				<div className='mb-2'>
					{radioData.radio_values.map((item, key) => {
						return (
							<div className='' key={key}>
								<input
									type='radio'
									name='radioAnswer'
									value={key}
									onClick={(e) => selectAnswerHandler(key)}
								></input>
								<input
									type='text'
									value={item}
									onChange={(e) => radioValuesHandler(key, e.target.value)}
									className='border border-gray-300 border-solid'
									key={key}
								/>

								<button
									onClick={(e) => {
										removeValue(key)
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
					addAnotherValue()
				}}
			>
				<PlusCircleIcon className='h-5 w-auto inline-block mr-2' />
				<div className='inline-block'>Add Another Field</div>
			</button>
		</div>
	)
}

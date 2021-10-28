import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
export default function checkboxQuizType({
	quillModules,
	quillFormats,
	checkboxData,
	index,
	quizDataChangeHandler,
}) {
	const checkboxValuesHandler = (key, value) => {
		let tempcheckboxValues = checkboxData.checkbox_values
		tempcheckboxValues[key] = value
		let tempcheckboxData = {
			...checkboxData,
			checkbox_values: tempcheckboxValues,
		}
		quizDataChangeHandler(tempcheckboxData, index)
	}

	const addAnotherValue = () => {
		let tempcheckboxValues = checkboxData.checkbox_values
		tempcheckboxValues.push("")
		let tempcheckboxData = {
			...checkboxData,
			checkbox_values: tempcheckboxValues,
		}
		quizDataChangeHandler(tempcheckboxData, index)
	}

	const removeValue = (key) => {
		let tempcheckboxValues = checkboxData.checkbox_values
		tempcheckboxValues.splice(key, 1)
		if (tempcheckboxValues.length === 0) {
			tempcheckboxValues.push("")
		}
		let tempcheckboxData = {
			...checkboxData,
			checkbox_values: tempcheckboxValues,
		}
		quizDataChangeHandler(tempcheckboxData, index)
	}

	const checkboxClickedHandler = (key, e) => {
		if (e.target.checked) {
			console.log("e.target.checked", e.target.checked)
			selectAnswerHandler(key)
		} else {
			console.log("e.target.checked", e.target.checked)
			removeAnswerHandler(key)
		}
	}
	const selectAnswerHandler = (key) => {
		let tempCheckboxAnswers = checkboxData.checkbox_answers
		let tempCheckboxAnswers2 = checkboxData.checkbox_answers
		// tempCheckboxAnswers.splice(key, 0, key)
		tempCheckboxAnswers.push(key)

		let tempCheckboxData = {
			...checkboxData,
			checkbox_answers: tempCheckboxAnswers,
		}
		quizDataChangeHandler(tempCheckboxData, index)
	}

	const removeAnswerHandler = (key) => {
		let tempCheckboxAnswers = checkboxData.checkbox_answers
		tempCheckboxAnswers.splice(tempCheckboxAnswers.indexOf(key), 1)
		let tempCheckboxData = {
			...checkboxData,
			checkbox_answers: tempCheckboxAnswers,
		}
		quizDataChangeHandler(tempCheckboxData, index)
	}

	return (
		<div className='bg-gray-200  mb-3 overflow-visible p-3'>
			<div className='mb-6 text-xl font-medium'>
				<div className='text-sm text-gray-400 border border-gray-400 rounded-full h-5 w-5 flex items-center justify-center mr-2 p-1'>
					{index + 1}
				</div>
				Multiple Choice (Checkbox)
			</div>
			<div className='mb-3'>
				<p className='text-sm'>Question Text</p>
				<ReactQuill
					className='bg-white'
					modules={quillModules}
					formats={quillFormats}
					theme='snow'
					value={checkboxData.question_text}
					onChange={(e) => {
						console.log(e)
						quizDataChangeHandler({ ...checkboxData, question_text: e }, index)
					}}
				/>
			</div>

			<div>
				<p className='text-sm'>Answers (Tick the correct answers.)</p>
				<div className='mb-2'>
					{checkboxData.checkbox_values.map((item, key) => {
						return (
							<div className='' key={key}>
								<input
									type='checkbox'
									name='checkboxAnswer'
									value={key}
									onChange={(e) => checkboxClickedHandler(key, e)}
								></input>
								<input
									type='text'
									value={item}
									onChange={(e) => checkboxValuesHandler(key, e.target.value)}
									className='border border-gray-300 border-solid'
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

import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "@heroicons/react/outline"
import dynamic from "next/dynamic"
import { useState } from "react"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function RadioComponent({
	index,
	questionData,
	answerRegisterer,
	answerPage,
	nextButtonActive,
	// nextButtonEnabler,
	nextButtonHandler,
	isLastQuestion,
}) {
	console.log("answerPage", answerPage)

	const selectAnswer = (e) => {
		let selectedAnswer = parseInt(e.target.value)
		let answerPageTemp = { ...answerPage, answers: selectedAnswer }
		answerRegisterer(index, answerPageTemp)
	}

	const enableNextButton = () => {
		if (answerPage.answers != null) {
			nextButtonEnabler(true)
		} else {
			nextButtonEnabler(false)
		}
	}

	// enableNextButton()

	return (
		<div className='mb-10'>
			<div className='bg-gray-100 m-3 shadow-md rounded-md p-3 flex flex-col items-center min-h-60vh justify-start '>
				<div className='text-2xs place-self-start'>Question {index + 1}</div>
				<div>
					<div className='flex p-2'>
						<ReactQuill
							className='h-full bg-gradient-to-b from-white to-gray-100 w-full min-h-full shadow'
							value={questionData.question_text}
							modules={{ toolbar: false }}
							readOnly={true}
							theme='snow'
						/>
					</div>
				</div>
				<div className='place-self-start'>
					<div>Pick the correct answer.</div>
					{questionData.radio_values.map((item, key) => {
						return (
							<div className='my-1' key={key}>
								<input
									className='form-radio inline-block self-center mr-2'
									type='radio'
									name='radioAnswer'
									value={key}
									onClick={selectAnswer}
								></input>
								<p className='inline-block'>{item}</p>
							</div>
						)
					})}
				</div>
			</div>
			<div>
				<button
					className={`mb-3 mx-3
								float-right
								overflow-visible 
								text-white 
								shadow-md 
								text-2xl 
								font-semibold 
								px-10 
								rounded-md ${
									nextButtonActive
										? `bg-gradient-to-r 
								from-green-500
								to-green-800 
								animate-gradient-xy`
										: "bg-green-900 opacity-40"
								}
								`}
					onClick={nextButtonHandler}
					disabled={!nextButtonActive}
				>
					{isLastQuestion ? "Submit" : "Next"}
				</button>
			</div>
		</div>
	)
}

import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "@heroicons/react/outline"
import dynamic from "next/dynamic"
import { useState } from "react"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function FitbComponent({
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

	const writeAnswer = ({ e, key }) => {
		console.log(e.target.value)
		console.log(key)
		let answerArrayTemp = JSON.parse(JSON.stringify(answerPage))
		answerArrayTemp.answers[key] = e.target.value
		console.log(answerArrayTemp)
		answerRegisterer(index, answerArrayTemp)
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
					<div>Fill in the blanks</div>
					{answerPage.answers.map((item, key) => {
						return (
							<div className='my-1'>
								<div className='text-2xs inline-block mr-2'>{key + 1}.</div>
								<input
									className='form-text inline-block mr-2 py-1 px-4 rounded-md border border-solid border-gray-300 shadow-md'
									type='text'
									name='fitbAnswer'
									key={key}
									value={item}
									onChange={(e) => {
										writeAnswer({ e, key })
									}}
								></input>
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

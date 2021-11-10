import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "@heroicons/react/outline"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function RadioComponent({ index, questionData }) {
	return (
		<div>
			<div className='bg-gray-100 m-3 shadow-md rounded-md p-3 flex flex-col items-center h-80 justify-start '>
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
							<div className='my-1'>
								<input
									className='inline-block self-center mr-2'
									type='radio'
									name='radioAnswer'
									value={key}
								></input>
								<p className='inline-block'>{item}</p>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

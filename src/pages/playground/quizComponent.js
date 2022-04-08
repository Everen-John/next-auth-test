import dynamic from "next/dynamic"
import React from "react"
import Layout from "../../components/master/layout"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

export default function QuizComponent() {
	return (
		<Layout>
			<div className='bg-gray-200 h-96'>
				<div className='bg-gray-400 flex flex-col min-h-full'>
					<div className='text-xl p-2 '>QUESTION 1</div>
					<ReactQuill
						className='h-full bg-gradient-to-b from-white to-gray-100 w-full min-h-full shadow'
						value={"<h1>Test</h1>"}
						modules={{ toolbar: false }}
						readOnly={true}
						theme='snow'
					/>
					<div className='bg-gray-500 flex-grow flex flex-col justify-start'>
						<div className='my-4 mx-2 overflow-visible bg-gray-200'>
							ANSWER 1
						</div>
						<div>ANSWER 2</div>
						<div>ANSWER 3</div>
					</div>
				</div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</Layout>
	)
}

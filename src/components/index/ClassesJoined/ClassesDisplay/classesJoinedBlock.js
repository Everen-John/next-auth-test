import ClassesJoinedCell from "./classesJoinedCell"
import Image from "next/image"

import { PlusIcon } from "@heroicons/react/solid"

export default function ClassesJoinedBlock({
	classesJoinedData,
	settxtJoinIntake,
	btnJoinIntake,
}) {
	return (
		<div className='bg-green-600 mb-2'>
			<h2 className='text-base pt-2 pl-2 text-white'>
				Classes You&apos;ve Joined
			</h2>
			<div className='overflow-x-auto whitespace-nowrap'>
				<div className='bg-white border border-solid rounded-md h-44 w-36 inline-block m-2 shadow-xl'>
					<div className='truncate text-xs pl-2 font-bold text-center'>
						Join a New Class!
					</div>
					<div className='flex justify-center'>
						<input
							type='text'
							id='txtClassCode'
							className='text-xs border border-solid border-gray-300 w-20 '
							onChange={(e) => {
								settxtJoinIntake(e.target.value)
							}}
						></input>
					</div>
					<div className=' flex justify-center p-1'>
						<button onClick={(e) => btnJoinIntake()}>
							<div>
								<PlusIcon className='h-32 w-16 text-green-600' />
							</div>
						</button>
					</div>
				</div>
				{classesJoinedData
					? classesJoinedData.map((item, key) => (
							<ClassesJoinedCell classJoinedData={item} key={key} />
					  ))
					: null}
			</div>

			<style jsx>
				{`
					.plusIcon > svg:hover {
						stroke: rgba(0, 0, 0);
					}
				`}
			</style>
		</div>
	)
}

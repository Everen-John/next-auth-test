import ClassesCreatedCell from "./ClassesCreatedCell"
import Link from "next/link"

import { PlusIcon } from "@heroicons/react/solid"

export default function ClassesJoinedBlock({
	classesJoinedData,
	settxtJoinIntake,
	btnJoinIntake,
}) {
	return (
		<div className='bg-green-600 mb-2'>
			<h2 className='text-base pt-2 pl-2 text-white'>Classes You've Created</h2>

			<div className='overflow-x-auto whitespace-nowrap'>
				<Link href={"/Joined/"}>
					<div className='bg-white border border-solid rounded-md h-44 w-36 inline-block m-2 shadow-xl'>
						<div className='truncate text-xs pl-2 font-bold text-center'>
							Create a New Class!
						</div>
						<div className='flex justify-center pt-2'>
							<PlusIcon className='h-36 w-16 text-green-600' />
						</div>
					</div>
				</Link>
				{classesJoinedData
					? classesJoinedData.map((item, key) => (
							<ClassesCreatedCell classJoinedData={item} key={key} />
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

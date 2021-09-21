import Head from "next/head"
import Image from "next/image"
import { useSession } from "next-auth/react"

export default function ClassesCell({ classJoinedData }) {
	return (
		<div className='bg-white border border-solid rounded-md h-44 w-36 inline-block m-2 shadow-xl'>
			<div className='truncate text-xs pl-2 font-bold'>
				{classJoinedData.class_name}
			</div>
			<div className='text-2xs pl-2 truncate'>
				id: {classJoinedData.intake_id}
			</div>
			<div className='flex justify-center pt-2'>
				<Image
					src={classJoinedData.icon ? icon : "https://via.placeholder.com/150"}
					width={120}
					height={120}
					objectFit='cover'
					className='rounded-xl'
				/>
			</div>
		</div>
	)
}

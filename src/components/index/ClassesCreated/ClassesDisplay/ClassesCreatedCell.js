import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function ClassesCell({ classCreatedData }) {
	console.log(classCreatedData)
	return (
		<Link href={`/Created/${classCreatedData.classes_data._id}`}>
			<div className='bg-white border border-solid rounded-md h-44 w-36 inline-block m-2 shadow-xl'>
				<div className='truncate text-xs pl-2 font-bold'>
					{classCreatedData.classes_data.class_name}
				</div>
				<div className='text-2xs pl-2 truncate'>
					id: {classCreatedData.classes_data._id}
				</div>
				<div className='flex justify-center pt-2'>
					<Image
						src={"https://via.placeholder.com/150"}
						width={128}
						height={130}
						objectFit='cover'
						className='rounded-xl'
					/>
				</div>
			</div>
		</Link>
	)
}

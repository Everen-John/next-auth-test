import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function ClassesCell({ classJoinedData }) {
	return (
		<Link href={"/Joined/" + classJoinedData.intake_id}>
			<div className='bg-white border border-solid rounded-md h-44 w-36 inline-block m-2 shadow-xl'>
				<div className='truncate text-xs pl-3 font-bold'>
					{classJoinedData.class_name}
				</div>
				<div className='text-2xs pl-3 truncate'>
					{classJoinedData.intake_name}
				</div>
				<div className='flex justify-center pt-2'>
					<Image
						src={
							classJoinedData.icon ? icon : "https://via.placeholder.com/150"
						}
						width={120}
						height={130}
						objectFit='cover'
						className='rounded-xl'
					/>
				</div>
			</div>
		</Link>
	)
}

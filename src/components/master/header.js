import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { signIn, signOut } from "next-auth/react"

export default function Header({ session }) {
	return (
		<div className='bg-gray-100 w-full flex p-3'>
			<Link href='/' passHref>
				<h1 className=' text-2xl font-light text-gray-600 cursor-pointer hover:text-green-700'>
					Eren
				</h1>
			</Link>
			<div className='flex-grow'></div>

			{session ? (
				<div className='flex flex-row'>
					<Image
						src={session.user.image}
						width={40}
						height={40}
						className='rounded-full '
					/>

					<button
						className='mr-1 text-red-500 self-center hover:underline ml-2'
						onClick={() => signOut()}
					>
						Sign out
					</button>
				</div>
			) : (
				<h3 className='pr-6 self-center hover:underline'>
					<button onClick={() => signIn()}>Sign in</button>
				</h3>
			)}
		</div>
	)
}

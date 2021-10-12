import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { signIn, signOut } from "next-auth/react"

export default function Header({ session }) {
	return (
		<div className='bg-gray-100 w-full flex p-3'>
			<Link href='/'>
				<h1 className='flex-grow text-2xl cursor-pointer hover:text-green-700'>
					Eren
				</h1>
			</Link>

			{session ? (
				<div className='flex flex-row'>
					<img
						src={session.user.image}
						width='40px'
						height='auto'
						className='rounded-full mr-2 border-solid border-gray-800 border-2'
					/>

					<button
						className='mr-1 text-red-500 self-center hover:underline'
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

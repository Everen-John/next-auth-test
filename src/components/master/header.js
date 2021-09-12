import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { signIn, signOut } from "next-auth/react"

export default function Component({ session }) {
	return (
		<div className='bg-gray-100 w-full flex pt-4 pb-4'>
			<h1 className='flex-grow pl-6 text-4xl'>Eren</h1>
			{session ? (
				<div className='flex flex-row'>
					<img
						src={session.user.image}
						width='40px'
						height='auto'
						className='rounded-full mr-4 border-solid border-gray-300 border-2'
					/>
					<h5 className='mr-10 self-center'>
						Signed in as {session.user.name}
					</h5>
					<button
						className='mr-10 text-red-500 self-center hover:underline'
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

import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

export default function Footer({ session }) {
	return (
		<div className=''>
			<footer className='bg-gray-100 p-6'>
				<p>Eren is made with ♥ by John</p>
				<span className='pr-2'>
					<a
						target='_blank'
						rel='noreferrer'
						href='https://www.linkedin.com/in/johntanhanseng/'
					>
						<Image src='/linked-in.svg' width={24} height={24} />
					</a>
				</span>
				<span className='pr-2'>
					<a
						target='_blank'
						rel='noreferrer'
						href='https://www.facebook.com/BurningF1re'
					>
						<Image src='/facebook.svg' width={24} height={24} />
					</a>
				</span>
				<span className='pr-2'>
					<a
						target='_blank'
						rel='noreferrer'
						href='https://github.com/Everen-John'
					>
						<Image src='/github.svg' width={24} height={24} />
					</a>
				</span>
			</footer>
		</div>
	)
}

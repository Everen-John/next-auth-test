import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import Header from "./header"
import Footer from "./footer"
export default function Layout({ children, session }) {
	return (
		<div className='h-screen'>
			<div className='bg-gray-900 min-h-full'>
				<Header session={session} />
				<main className='overflow-visible md:mx-32'>{children}</main>
			</div>
			<Footer />
		</div>
	)
}

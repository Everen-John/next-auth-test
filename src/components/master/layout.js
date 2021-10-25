import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import Header from "./header"
import Footer from "./footer"
export default function Layout({ children, session }) {
	return (
		<div>
			<div className='bg-gray-900 min-h-screen'>
				<Header session={session} />
				<main className=''>{children}</main>
			</div>
			<Footer />
		</div>
	)
}

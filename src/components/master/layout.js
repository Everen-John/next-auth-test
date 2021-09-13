import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import Header from "./header"
import Footer from "./footer"

export default function layout({ children, session }) {
	return (
		<div className=''>
			<Header session={session} />
			<main className='bg-green-200  '>{children}</main>
			<Footer />
		</div>
	)
}

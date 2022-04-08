import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import AnnouncementBlock from "./announcementBlock"
import { useState } from "react"

export default function CalendarCell({
	dayNum,
	announcementDatas,
	calendarDatas,
	isToday,
	id,
}) {
	const [showModal, setShowModal] = useState(false)
	console.log("announcementDatas", announcementDatas)
	return (
		<div
			className='border-solid border-b-2 p-1 h-20 bg-white'
			onClick={(e) => setShowModal(!showModal)}
		>
			<div
				className={
					isToday
						? "pl-1 pr-1 inline text-2xs bg-green-600 rounded-full text-white"
						: "pl-1 pr-1 inline text-2xs"
				}
			>
				{dayNum}
			</div>
			{announcementDatas
				? announcementDatas.map((item) => {
						return (
							<AnnouncementBlock
								announcementData={item}
								key={item.announcement_id}
							/>
						)
				  })
				: null}

			{showModal ? (
				<>
					<div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none mx-2 md:mx-56'>
						<div className='relative w-full my-6 mx-auto max-w-3xl'>
							{/*content*/}
							<div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
								{/*header*/}
								<div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
									<h3 className='text-3xl font-semibold'>
										{dayNum +
											" " +
											calendarDatas.thisMonthName +
											" " +
											calendarDatas.thisYear}
									</h3>
									<button
										className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
										onClick={() => setShowModal(false)}
									>
										<span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
											×
										</span>
									</button>
								</div>
								{/*body*/}
								<div className='relative p-2 flex-auto'>
									{announcementDatas ? (
										announcementDatas.map((item, key) => (
											<Link
												href={
													item.createdIntake
														? `/Created/${item.class_id}?get_intake_id=${item.intake_id}`
														: `/Joined/${item.intake_id}`
												}
												key={key}
											>
												<div
													className={
														" rounded-md my-4 text-blueGray-500 text-lg leading-relaxed p-2 " +
														item.bgcolor
													}
													key={item.announcement_id}
												>
													<div className='flex flex-row mb-4'>
														{item.createdIntake ? (
															<svg
																xmlns='http://www.w3.org/2000/svg'
																className='h-8 w-8 inline-block mr-1'
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'
															>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={2}
																	d='M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
																/>
															</svg>
														) : null}
														<div className='pl-2 text-xl flex-grow font-bold'>
															{item.announcement_title}
														</div>
														<div className='pr-2 text-2xs self-center italic '>
															<div>{item.class_name}</div>
															<div>{item.intake_name}</div>
														</div>
													</div>

													<div className='pl-2 text-xs'>
														{item.announcement_description}
													</div>
												</div>
											</Link>
										))
									) : (
										<p>No announcements here!</p>
									)}
								</div>
								{/*footer*/}
								<div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
									<button
										className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
										type='button'
										onClick={() => setShowModal(false)}
									>
										Close
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
				</>
			) : null}
		</div>
	)
}

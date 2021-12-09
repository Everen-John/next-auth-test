export default function AnnouncementBlock({ announcementData, link }) {
	return (
		<div>
			<div
				className={
					"pl-1 truncate text-3xs text-white rounded-l " +
					announcementData.bgcolor
				}
			>
				{announcementData.createdIntake ? (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-4 w-4 inline-block mr-1'
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
				{announcementData.announcement_title}
			</div>
		</div>
	)
}

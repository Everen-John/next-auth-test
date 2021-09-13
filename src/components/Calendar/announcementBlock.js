export default function announcementBlock({ announcementData, link }) {
	return (
		<div>
			<div
				className={
					"pl-2 truncate text-xs text-white rounded-md " +
					announcementData.bgcolor
				}
			>
				{announcementData.announcement_title}
			</div>
		</div>
	)
}

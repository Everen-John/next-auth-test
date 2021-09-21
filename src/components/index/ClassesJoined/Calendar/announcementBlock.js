export default function AnnouncementBlock({ announcementData, link }) {
	return (
		<div>
			<div
				className={
					"pl-1 truncate text-3xs text-white rounded-l " +
					announcementData.bgcolor
				}
			>
				{announcementData.announcement_title}
			</div>
		</div>
	)
}

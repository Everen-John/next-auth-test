import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "@heroicons/react/outline"

import ClassJoinedWeeklyBlock from "./classCreatedWeeklyBlock"
import ClassCreatedYearlyBlock from "./classCreatedYearlyBlock"

export default function ClassCreatedContentBlock({ intakeCreated, classid }) {
	return (
		<div className='bg-gray-700 p-1'>
			{intakeCreated.yearlyItems.map((yearlyItem, key) => {
				return (
					<ClassCreatedYearlyBlock
						key={key}
						yearlyItem={yearlyItem}
						classid={classid}
					/>
				)
			})}
		</div>
	)
}

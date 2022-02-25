import React from "react"
import { useTimer } from "react-timer-hook"

export default function TimerComponent({
	expiryMinutes,
	performSubmissionHandler,
}) {
	let expiryTimestamp = new Date()
	expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + expiryMinutes * 60)
	const {
		seconds,
		minutes,
		hours,
		days,
		isRunning,
		start,
		pause,
		resume,
		restart,
	} = useTimer({
		expiryTimestamp,
		onExpire: () => performSubmissionHandler(),
		autoStart: true,
	})

	return (
		<div>
			<div className='bg-gray-300 inline-block ml-2 p-2 shadow-lg rounded-md'>
				Time remaining: <span>{hours}</span>:<span>{minutes}</span>:
				<span>{seconds}</span>
			</div>
		</div>
	)
}

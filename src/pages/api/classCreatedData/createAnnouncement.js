import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function createQuiz(req, res) {
	let userid = req.body.userid
	let intakeid = req.body.intakeid
	let announcementData = req.body.announcementData

	console.log("userid", userid)
	console.log("intakeid", intakeid)
	console.log("announcementData", announcementData)

	const client = await clientPromise

	// // Step 1: Start a Client Session
	const session = await client.startSession()
	// // Step 2: Optional. Define options to use for the transaction
	const transactionOptions = {
		readPreference: "primary",
		readConcern: { level: "local" },
		writeConcern: { w: "majority" },
	}
	// // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
	// // Note: The callback for withTransaction MUST be async and/or return a Promise.

	try {
		await session.withTransaction(async () => {
			const intakeColl = client
				.db(process.env.DATABASE_NAME)
				.collection(process.env.intakes_coll)
			const announcementsColl = client
				.db(process.env.DATABASE_NAME)
				.collection(process.env.announcements_coll)

			// Important:: You must pass the session to the operations
			let announcement_created = await announcementsColl.insertOne(
				{
					in_intake_oID: new ObjectId(announcementData.in_intake_oID),
					announcement_Title: announcementData.announcement_Title,
					announcement_description: announcementData.announcement_description,
					publish_time: new Date(announcementData.publish_time),
					bgcolor: announcementData.bgcolor,
				},
				{ session }
			)
			console.log("Announcement oID: ", announcement_created.insertedId)
			let intakeData = await intakeColl.updateOne(
				{ _id: new ObjectId(announcementData.in_intake_oID) },
				{
					$push: {
						announcement_oIDs: new ObjectId(announcement_created.insertedId),
					},
				},
				{ session }
			)
			console.log(intakeData)
		}, transactionOptions)
		res.status(200).send({ msg: "ok" })
	} catch (e) {
		console.log(e)
		res.status(424).send({ msg: "failed" })
	} finally {
	}
}

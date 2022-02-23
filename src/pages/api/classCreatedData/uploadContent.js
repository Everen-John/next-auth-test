import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageData(req, res) {
	let contentData = req.body.contentData
	let user = req.body.user
	console.log(contentData)

	const client = await clientPromise

	// Step 1: Start a Client Session
	const session = await client.startSession()
	// Step 2: Optional. Define options to use for the transaction
	const transactionOptions = {
		readPreference: "primary",
		readConcern: { level: "local" },
		writeConcern: { w: "majority" },
	}
	// Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
	// Note: The callback for withTransaction MUST be async and/or return a Promise.

	try {
		await session.withTransaction(async () => {
			const intakeColl = client
				.db(process.env.DATABASE_NAME)
				.collection("intakes")
			const contentsColl = client
				.db(process.env.DATABASE_NAME)
				.collection("contents")

			// Important:: You must pass the session to the operations
			let content_uploaded = await contentsColl.insertOne(
				{
					in_intake_oID: new ObjectId(contentData.in_intake_oID),
					title: contentData.title,
					description: contentData.description,
					publish_time: new Date(contentData.publish_time),
					deadline: new Date(contentData.deadline),
					content_markup: contentData.content_markup,
				},
				{ session }
			)
			console.log("content oID: ", content_uploaded.insertedId)
			let intakeData = await intakeColl.updateOne(
				{ _id: new ObjectId(contentData.in_intake_oID) },
				{ $push: { content_oIDs: new ObjectId(content_uploaded.insertedId) } },
				{ session }
			)
			console.log(intakeData)
		}, transactionOptions)
	} catch (e) {
		console.log(e)
	} finally {
		await session.endSession()
	}
	res.status(200).send({ msg: "ok" })
}

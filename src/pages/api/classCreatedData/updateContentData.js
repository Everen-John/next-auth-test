import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function updateContentData(req, res) {
	let intakeid = req.body.intakeid
	let user = req.body.user
	let contentid = req.body.contentid
	let formData = req.body.formData

	console.log("user", user)
	console.log("intakeid", intakeid)
	console.log("contentid", contentid)
	console.log(formData)
	const client = await clientPromise

	var db = await client.db(process.env.DATABASE_NAME)

	// Step 1: Start a Client Session
	const session = client.startSession()
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
			const contentsColl = client
				.db(process.env.DATABASE_NAME)
				.collection("contents")
			// Important:: You must pass the session to the operations
			let contentColl_data = await contentsColl.updateOne(
				{ _id: ObjectId(contentid) },
				{
					$set: {
						content_markup: formData.content_markup,
						description: formData.description,
						title: formData.title,
						publish_time: new Date(formData.publish_time),
						deadline: new Date(formData.deadline),
					},
				},
				{ session }
			)
			console.log(contentsColl)
		}, transactionOptions)
		res.status(200).send({ msg: "ok" })
	} finally {
		await session.endSession()
	}
}

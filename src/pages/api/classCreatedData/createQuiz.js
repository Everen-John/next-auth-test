import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function createQuiz(req, res) {
	let formData = req.body.formData

	let user = req.body.user
	console.log(formData)

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
			const quizesColl = client
				.db(process.env.DATABASE_NAME)
				.collection("quizes")

			// Important:: You must pass the session to the operations
			let quiz_uploaded = await quizesColl.insertOne(
				{
					in_intake_oID: new ObjectId(formData.in_intake_oID),
					title: formData.title,
					description: formData.description,
					publish_time: new Date(formData.publish_time),
					deadline: new Date(formData.deadline),
					questions: formData.questions,
					completionTime: formData.completionTime,
				},
				{ session }
			)
			console.log("quiz oID: ", quiz_uploaded.insertedId)
			let intakeData = await intakeColl.updateOne(
				{ _id: new ObjectId(formData.in_intake_oID) },
				{ $push: { quiz_oIDs: new ObjectId(quiz_uploaded.insertedId) } },
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

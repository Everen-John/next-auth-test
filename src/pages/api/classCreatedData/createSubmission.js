import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function createQuiz(req, res) {
	let userid = req.body.userid
	let intakeid = req.body.intakeid
	let submissionData = req.body.submissionData

	console.log("userid", userid)
	console.log("intakeid", intakeid)
	console.log("submissionData", submissionData)

	const client = await clientPromise

	// // // Step 1: Start a Client Session
	const session = await client.startSession()
	// // // Step 2: Optional. Define options to use for the transaction
	const transactionOptions = {
		readPreference: "primary",
		readConcern: { level: "local" },
		writeConcern: { w: "majority" },
	}
	// // // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
	// // // Note: The callback for withTransaction MUST be async and/or return a Promise.

	try {
		await session.withTransaction(async () => {
			const submissionsColl = client
				.db(process.env.DATABASE_NAME)
				.collection(process.env.submissions_coll)
			const intakesColl = client
				.db(process.env.DATABASE_NAME)
				.collection(process.env.intakes_coll)

			// 		// Important:: You must pass the session to the operations
			let submission_created = await submissionsColl.insertOne(
				{
					in_intake_oID: new ObjectId(submissionData.in_intake_oID),
					submission_Title: submissionData.submission_Title,
					submission_description: submissionData.submission_description,
					publish_time: new Date(submissionData.publish_time),
					deadline: new Date(submissionData.deadline),
					fileFormats: submissionData.fileFormats,
					maxFileSize: submissionData.maxFileSize,
					maxNumberOfFiles: parseInt(submissionData.maxNumberOfFiles),
					namingConvention: submissionData.namingConvention,
				},
				{ session }
			)
			console.log("Submission_oID: ", submission_created.insertedId)
			let intakeData = await intakesColl.updateOne(
				{ _id: new ObjectId(submissionData.in_intake_oID) },
				{
					$push: {
						submission_oIDs: new ObjectId(submission_created.insertedId),
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

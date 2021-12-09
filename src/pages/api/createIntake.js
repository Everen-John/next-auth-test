import clientPromise from "../../lib/mongodb"
import { ObjectId } from "bson"
import loadCustomRoutes from "next/dist/lib/load-custom-routes"

export default async function createIntake(req, res) {
	let userid = req.body.userid
	let classid = req.body.classid
	let intakeName = req.body.intakeName

	if (!userid || !classid || !intakeName) {
		await res
			.status(200)
			.json({ created: false, msg: "Field is empty!", success: false })
		return
	}

	const client = await clientPromise

	return new Promise(async (resolve, reject) => {
		let intakeAdded = await createIntakeAndUpdateClass(
			client,
			userid,
			classid,
			intakeName
		)
		console.log("intakeAdded", intakeAdded)
		resolve(intakeAdded)
	})
		.then((intakeAdded) => {
			res.status(200).json({
				msg: "ok",
				...intakeAdded,
			})
		})
		.catch((e) => {
			res.status(200).json({ msg: "Error occured!", success: false })
		})
}

const createIntakeAndUpdateClass = async (
	client,
	userid,
	classid,
	intakeName
) => {
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
		let intakeAdded

		let res = await session.withTransaction(async () => {
			return new Promise(async (resolve, reject) => {
				const intakeColl = client
					.db(process.env.DATABASE_NAME)
					.collection(process.env.intakes_coll)
				const classColl = client
					.db(process.env.DATABASE_NAME)
					.collection(process.env.classes_coll)
				const userColl = client
					.db(process.env.DATABASE_NAME)
					.collection(process.env.users_coll)

				// Important:: You must pass the session to the operations

				let intakeData = await intakeColl.insertOne(
					{
						student_oIDs: [],
						teacher_oIDs: [ObjectId(userid)],
						quiz_oIDs: [],
						content_oIDs: [],
						files_oIDs: [],
						announcement_oIDs: [],
						date_created: new Date(),
						intake_name: intakeName,
					},

					{ session }
				)
				console.log("intakeData", intakeData)
				let classData = await classColl.updateOne(
					{
						_id: ObjectId(classid),
					},
					{
						$push: {
							intake_oIDs: ObjectId(intakeData.insertedId),
						},
					},
					{ session }
				)
				console.log("classData", classData)

				let intakeData2 = await intakeColl.updateOne(
					{
						_id: ObjectId(intakeData.insertedId),
					},
					{
						$set: { class_oID: ObjectId(classid) },
					},
					{ session }
				)
				let userData = await userColl.updateOne(
					{
						_id: ObjectId(userid),
					},
					{
						$push: {
							classes_taught: ObjectId(classData.insertedId),
							intakes_taught: ObjectId(intakeData.insertedId),
						},
					}
				)
				intakeAdded = intakeData.insertedId

				resolve({
					intakeid: await intakeData.insertedId,
					success: true,
				})
			})
		}, transactionOptions)
		return {
			intakeid: intakeAdded,
			success: true,
		}
	} catch (e) {
		console.log(e)
		return false
	} finally {
	}
}

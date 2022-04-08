import clientPromise from "../../lib/mongodb"
import { ObjectId } from "bson"
import loadCustomRoutes from "next/dist/lib/load-custom-routes"

export default async function createClass(req, res) {
	let userid = req.body.userid
	let className = req.body.className
	let intakeName = req.body.intakeName
	let icon = req.body.icon

	if (!userid || !className || !intakeName) {
		await res
			.status(200)
			.json({ created: false, msg: "Field is empty!", success: false })
		return
	}
	const client = await clientPromise

	return new Promise(async (resolve, reject) => {
		let classAddedId = await createClassAndIntake(
			client,
			userid,
			className,
			intakeName,
			icon
		)
		resolve(classAddedId)
	})
		.then((classAddedId) => {
			console.log("Hello!")
			console.log(classAddedId)
			res.status(200).json({
				classid: classAddedId,
				msg: "ok",
				success: true,
			})
		})
		.catch((e) => {
			res.status(200).json({ msg: "Error occured!", success: false })
		})
}

const createClassAndIntake = async (
	client,
	userid,
	className,
	intakeName,
	icon
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

	let classid
	try {
		await session.withTransaction(async () => {
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
			let classData = await classColl.insertOne(
				{
					class_name: className,
					intake_oIDs: [ObjectId(intakeData.insertedId)],
					creator_oID: ObjectId(userid),
					icon: icon,
					created_on: new Date(),
				},
				{ session }
			)
			console.log("classData", classData)

			let intakeData2 = await intakeColl.updateOne(
				{
					_id: ObjectId(intakeData.insertedId),
				},
				{
					$set: { class_oID: ObjectId(classData.insertedId) },
				},
				{ session }
			)
			let userData = await userColl.updateOne(
				{
					_id: ObjectId(userid),
				},
				{
					$push: {
						intakes_taught: ObjectId(intakeData.insertedId),
						classes_taught: ObjectId(classData.insertedId),
					},
				}
			)
			classid = classData.insertedId

			console.log(intakeData2)
		}, transactionOptions)
		return classid
	} catch (e) {
		console.log(e)
		return false
	} finally {
	}
}

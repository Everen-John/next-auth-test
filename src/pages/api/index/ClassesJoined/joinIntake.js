import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "bson"
import loadCustomRoutes from "next/dist/lib/load-custom-routes"

export default async function joinIntake(req, res) {
	let user = req.body.user
	let intakeCode = req.body.txtJoinIntake

	if (!intakeCode) {
		await res.status(200).json({ joined: false, msg: "Field is empty!" })
		return
	}

	console.log(intakeCode)
	const client = await clientPromise

	return new Promise(async (resolve, reject) => {
		let userHasJoinedBefore = await checkIfUserHasJoinedBefore(
			client,
			user,
			intakeCode
		)
		if (userHasJoinedBefore) {
			reject()
		} else {
			resolve()
		}
	})
		.then(
			async () => {
				let addUserToIntake = await adduserToIntake(client, user, intakeCode)
			},
			() => {
				return res
					.status(200)
					.json({ joined: false, msg: "You has already joined this intake!" })
			}
		)
		.then(() => {
			return res.status(200).json({ joined: true, msg: "Successfully joined!" })
		})
		.catch((e) => {
			res.status(200).json({ joined: false, msg: "Error occured!" })
		})
}

const checkIfUserHasJoinedBefore = async (client, user, intakeCode) => {
	return new Promise(async (resolve, reject) => {
		var db = await client.db(process.env.DATABASE_NAME)
		var collection = await db.collection(process.env.users_coll)

		var options = {}

		var pipeline = [
			{
				$match: { _id: ObjectId(user) },
			},
			{
				$unwind: { path: "$intakes_joined" },
			},
			{
				$lookup: {
					from: "intakes",
					localField: "intakes_joined",
					foreignField: "_id",
					as: "intakes_data",
				},
			},
			{
				$unwind: { path: "$intakes_data" },
			},
			{
				$group: {
					_id: { $eq: ["$intakes_data._id", new ObjectId(intakeCode)] },
				},
			},
		]

		var cursor = await collection.aggregate(pipeline, options)
		var finalData = await cursor.toArray()
		console.log(finalData)
		let hasJoined = false
		finalData.forEach(async (item) => {
			if (item._id) {
				hasJoined = true
			} else {
			}
		})

		resolve(hasJoined)
	})
}

const adduserToIntake = async (client, user, intakeCode) => {
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
			const userColl = client
				.db(process.env.DATABASE_NAME)
				.collection(process.env.users_coll)

			// Important:: You must pass the session to the operations
			let userData = await userColl.updateOne(
				{
					_id: ObjectId(user),
				},
				{
					$push: {
						intakes_joined: ObjectId(intakeCode),
					},
				},
				{ session }
			)
			let intakeData = await intakeColl.updateOne(
				{ _id: ObjectId(intakeCode) },
				{
					$push: {
						student_oIDs: ObjectId(user),
					},
				},
				{ session }
			)
		}, transactionOptions)
		return true
	} catch (e) {
		console.log(e)
		return false
	} finally {
	}
}

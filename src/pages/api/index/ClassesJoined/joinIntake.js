import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "bson"
import loadCustomRoutes from "next/dist/lib/load-custom-routes"

export default async function joinIntake(req, res) {
	let user = req.body.user
	let intake = req.body.txtJoinIntake

	if (!intake) {
		await res.status(200).json({ joined: false, msg: "Field is empty!" })
		return
	}
	console.log(intake)
	const client = await clientPromise

	var db = await client.db(process.env.DATABASE_NAME)
	var collection = await db.collection("users")

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
			$group: { _id: { $eq: ["$intakes_data.intake_code", intake] } },
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

	if (hasJoined) {
		await res
			.status(200)
			.json({ joined: false, msg: "You have already joined this class!" })
		return
	} else {
		//Check if Code exists

		await res
			.status(200)
			.json({ joined: true, refresh: true, msg: "Successfully joined!" })

		return
	}
}

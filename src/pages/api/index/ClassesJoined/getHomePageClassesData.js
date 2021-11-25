import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageData(req, res) {
	let monthSelected = req.body.month
	let user = req.body.user

	const client = await clientPromise

	var db = await client.db(process.env.DATABASE_NAME)
	var collection = await db.collection("users")

	var options = {}

	var pipeline = [
		{
			$match: {
				_id: new ObjectId(user),
			},
		},
		{
			$unwind: {
				path: "$intakes_joined",
			},
		},
		{
			$lookup: {
				from: "class",
				localField: "intakes_joined",
				foreignField: "intake_oIDs",
				as: "class_data",
			},
		},
		{
			$unwind: {
				path: "$class_data",
			},
		},
		{
			$project: {
				class_name: "$class_data.class_name",
				intake_id: "$intakes_joined",
				class_icon: "$class_data.icon",
			},
		},
		{
			$sort: { class_name: 1 },
		},
	]

	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	res.status(200).json(finalData)
}

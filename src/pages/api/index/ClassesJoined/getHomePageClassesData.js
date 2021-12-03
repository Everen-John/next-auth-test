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
				_id: new ObjectId("613daad6f1c942e1a2cada63"),
			},
		},
		{
			$unwind: {
				path: "$intakes_joined",
			},
		},
		{
			$lookup: {
				from: "intakes",
				localField: "intakes_joined",
				foreignField: "_id",
				as: "intake_data",
			},
		},
		{
			$project: {
				_id: 0,
				intake: {
					$first: "$intake_data",
				},
			},
		},
		{
			$lookup: {
				from: "class",
				localField: "intake.class_oID",
				foreignField: "_id",
				as: "class_data",
			},
		},
		{
			$project: {
				class_name: {
					$first: "$class_data.class_name",
				},
				intake_id: "$intake._id",
				class_icon: {
					$first: "$class_data.icon",
				},
				intake_name: "$intake.intake_name",
			},
		},
	]

	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	res.status(200).json(finalData)
}

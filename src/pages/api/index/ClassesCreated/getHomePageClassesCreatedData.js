import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageClassesCreatedData(req, res) {
	let user = req.body.user

	const client = await clientPromise

	var db = await client.db(process.env.DATABASE_NAME)
	var collection = await db.collection("users")

	var options = {}

	var pipeline = [
		{
			$match: {
				_id: new ObjectId(req.body.user),
			},
		},
		{
			$unwind: {
				path: "$classes_taught",
			},
		},
		{
			$lookup: {
				from: "class",
				localField: "classes_taught",
				foreignField: "_id",
				as: "classes_data",
			},
		},
		{
			$project: {
				classes_data: 1.0,
				_id: 0.0,
			},
		},
		{
			$unwind: {
				path: "$classes_data",
			},
		},
		{
			$sort: {
				"classes_data.created_on": -1.0,
			},
		},
	]

	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()

	res.status(200).json(finalData)
}

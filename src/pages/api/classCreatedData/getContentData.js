import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getContentData(req, res) {
	let intakeid = req.body.intakeid
	let user = req.body.user
	let contentid = req.body.contentid

	console.log("user", user)
	console.log("intakeid", intakeid)
	console.log("contentid", contentid)
	const client = await clientPromise

	var db = await client.db(process.env.DATABASE_NAME)
	var collection = await db.collection("intakes")

	var options = {}

	var pipeline = [
		{
			$match: {
				_id: new ObjectId("6140115086beabb9ec5be370"),
			},
		},
		{
			$unwind: {
				path: "$content_oIDs",
			},
		},
		{
			$match: {
				content_oIDs: new ObjectId("6173234145f82015655d20c4"),
			},
		},
		{
			$lookup: {
				from: "contents",
				localField: "content_oIDs",
				foreignField: "_id",
				as: "content_data",
			},
		},
		{
			$project: {
				_id: 0,
				contentData: {
					$first: "$content_data",
				},
			},
		},
	]

	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	res.status(200).json(finalData[0])
}

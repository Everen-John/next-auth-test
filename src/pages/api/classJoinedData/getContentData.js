import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageData(req, res) {
	let intakeid = req.body.intakeid
	let user = req.body.user
	let contentid = req.body.contentid

	console.log(user)
	console.log(intakeid)
	console.log(contentid)
	const client = await clientPromise

	var db = await client.db(process.env.DATABASE_NAME)
	var collection = await db.collection("intakes")

	var options = {}

	var pipeline = [
		{
			$match: {
				_id: new ObjectId(intakeid),
			},
		},
		{
			$project: {
				content_oIDs: 1,
			},
		},
		{
			$unwind: {
				path: "$content_oIDs",
			},
		},
		{
			$match: {
				content_oIDs: new ObjectId(contentid),
			},
		},
		{
			$lookup: {
				from: "contents",
				localField: "content_oIDs",
				foreignField: "_id",
				as: "contentData",
			},
		},
		{
			$unwind: {
				path: "$contentData",
			},
		},
	]

	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	res.status(200).json(finalData[0])
}

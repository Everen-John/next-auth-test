import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageData(req, res) {
	let intakeid = req.body.intakeid
	let userid = req.body.userid
	let submissionid = req.body.submissionid

	console.log("userid", userid)
	console.log("intakeid", intakeid)
	console.log("submissionid", submissionid)
	const client = await clientPromise

	var db = await client.db(process.env.DATABASE_NAME)
	var collection = await db.collection(process.env.submissions_coll)

	var options = {}

	var pipeline = [
		{
			$match: {
				_id: new ObjectId(submissionid),
				"submitters.submitter_oID": new ObjectId(userid),
			},
		},
		{
			$unwind: {
				path: "$submitters",
			},
		},
		{
			$project: {
				submitters: 1,
			},
		},
	]

	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	res.status(200).json(finalData)
}

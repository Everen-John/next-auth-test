import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getQuizData(req, res) {
	let intakeid = req.body.intakeid
	let userid = req.body.user
	let quizid = req.body.quizid

	console.log("user", userid)
	console.log("intakeid", intakeid)
	console.log("quizid", quizid)

	const client = await clientPromise

	var db = await client.db(process.env.DATABASE_NAME)
	var collection = await db.collection("quizes")

	var options = {}

	var pipeline = [
		{
			$match: {
				_id: new ObjectId(quizid),
			},
		},
		{
			$project: {
				attempters: 1,
			},
		},
		{
			$unwind: {
				path: "$attempters",
			},
		},
		{
			$match: {
				"attempters.attempter_oID": new ObjectId(userid),
			},
		},
	]
	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	if (finalData.length > 0) {
		res.status(200).json({ attempted: true })
	} else {
		res.status(200).json({ attempted: false })
	}
}

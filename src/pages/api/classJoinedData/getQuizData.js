import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getQuizData(req, res) {
	let intakeid = req.body.intakeid
	let user = req.body.user
	let quizid = req.body.quizid

	console.log("user", user)
	console.log("intakeid", intakeid)
	console.log("quizid", quizid)

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
			$project: {
				_id: 1,
				quiz_oIDs: 1,
			},
		},
		{
			$unwind: {
				path: "$quiz_oIDs",
			},
		},
		{
			$match: {
				quiz_oIDs: new ObjectId("61865a99e58d5892ab28229c"),
			},
		},
		{
			$lookup: {
				from: "quizes",
				localField: "quiz_oIDs",
				foreignField: "_id",
				as: "quizData",
			},
		},
		{
			$project: {
				_id: 0,
				quizData: {
					$first: "$quizData",
				},
			},
		},
		{
			$project: {
				_id: "$quizData._id",
				title: "$quizData.title",
				description: "$quizData.description",
				publish_time: "$quizData.publish_time",
				deadline: "$quizData.deadline",
			},
		},
	]

	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	res.status(200).json(finalData[0])
}

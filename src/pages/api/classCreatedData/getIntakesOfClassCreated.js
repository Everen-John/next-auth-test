import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageData(req, res) {
	let classid = req.body.classid
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
				path: "$classes_taught",
			},
		},
		{
			$match: {
				classes_taught: new ObjectId(classid),
			},
		},
		{
			$project: {
				classes_taught: 1.0,
				_id: 0.0,
			},
		},
		{
			$lookup: {
				from: "class",
				localField: "classes_taught",
				foreignField: "_id",
				as: "class_data",
			},
		},
		{
			$project: {
				classData: {
					$first: "$class_data",
				},
			},
		},
		{
			$project: {
				intake_oIDs: "$classData.intake_oIDs",
				_id: 0.0,
			},
		},
		{
			$unwind: {
				path: "$intake_oIDs",
			},
		},
		{
			$lookup: {
				from: "intakes",
				localField: "intake_oIDs",
				foreignField: "_id",
				as: "intake_data",
			},
		},
		{
			$project: {
				intakeData: {
					$first: "$intake_data",
				},
			},
		},
		{
			$project: {
				class_oID: "$intakeData.class_oID",
				intake_oID: "$intakeData._id",
				student_oIDs: "$intakeData.student_oIDs",
				teacher_oIDs: "$intakeData.teacher_oIDs",
				date_created: "$intakeData.date_created",
				intake_code: "$intakeData.intake_code",
			},
		},
	]
	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	res.status(200).json(finalData)
}

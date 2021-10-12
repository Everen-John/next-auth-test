import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageData(req, res) {
	let monthSelected = req.body.month
	let yearSelected = req.body.year
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
			$project: {
				intakes_joined: 1.0,
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
				foreignField: "_id",
				localField: "intakes_joined",
				as: "intakes_data",
			},
		},
		{
			$project: {
				_id: 0.0,
				intakes_joined: 1.0,
				intakes_data: 1.0,
			},
		},
		{
			$unwind: {
				path: "$intakes_data",
			},
		},
		{
			$addFields: {
				announcements: "$intakes_data.announcement_oIDs",
			},
		},
		{
			$unwind: {
				path: "$announcements",
			},
		},
		{
			$lookup: {
				from: "Announcements",
				localField: "announcements",
				foreignField: "_id",
				as: "announcement_data",
			},
		},
		{
			$unwind: {
				path: "$announcement_data",
			},
		},
		{
			$lookup: {
				from: "class",
				foreignField: "_id",
				localField: "intakes_data.class_oID",
				as: "class_data",
			},
		},
		{
			$unwind: {
				path: "$class_data",
			},
		},
		{
			$addFields: {
				intake_name: "$class_data.class_name",
				announcement_title: "$announcement_data.announcement_Title",
				announcement_description: "$announcement_data.announcement_description",
				bgcolor: "$announcement_data.bgcolor",
				publish_time: "$announcement_data.publish_time",
				month: {
					$month: {
						date: "$announcement_data.publish_time",
					},
				},
			},
		},
		{
			$project: {
				intake_name: 1.0,
				intakes_id: "$intakes_joined",
				announcement_id: "$announcements",
				announcement_title: 1.0,
				announcement_description: 1.0,
				publish_time: 1.0,
				bgcolor: 1.0,
				month: 1.0,
				year: { $year: "$publish_time" },
			},
		},
		{
			$match: {
				month: monthSelected,
				year: yearSelected,
			},
		},
		{
			$group: {
				_id: {
					$dayOfMonth: "$publish_time",
				},
				announcements: {
					$push: {
						class_name: "$intake_name",
						announcement_title: "$announcement_title",
						announcement_description: "announcement_description",
						bgcolor: "$bgcolor",
						month: "$month",
						intake_id: "$intakes_id",
						announcement_id: "$announcement_id",
					},
				},
			},
		},
		{
			$sort: {
				_id: 1.0,
			},
		},
	]

	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()

	res.status(200).json(finalData)
}

import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageData(req, res) {
	let monthSelected = req.body.month
	let user = req.body.user

	const client = await clientPromise

	var db = client.db("eren-db")
	var collection = db.collection("users")

	var options = {}

	var pipeline = [
		{
			$match: {
				_id: new ObjectId(user),
			},
		},
		{
			$project: {
				classes_joined: 1.0,
			},
		},
		{
			$unwind: {
				path: "$classes_joined",
			},
		},
		{
			$lookup: {
				from: "classrooms",
				foreignField: "_id",
				localField: "classes_joined",
				as: "classes_data",
			},
		},
		{
			$project: {
				_id: 0.0,
				classes_joined: 1.0,
				classes_data: 1.0,
			},
		},
		{
			$unwind: {
				path: "$classes_data",
			},
		},
		{
			$addFields: {
				announcements: "$classes_data.announcement_oIDs",
			},
		},
		{
			$unwind: {
				path: "$announcements",
			},
		},
		{
			$lookup: {
				from: "announcements",
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
			$addFields: {
				class_name: "$classes_data.class_name",
				announcement_title: "$announcement_data.announcement_Title",
				announcement_description: "$announcement_data.announcement_description",
				bgcolor: "$announcement_data.bgcolor",
				announcement_deadline: "$announcement_data.announcement_deadline",
				month: {
					$month: {
						date: "$announcement_data.announcement_deadline",
					},
				},
			},
		},
		{
			$project: {
				class_name: 1.0,
				classes_id: "$classes_joined",
				announcement_id: "$announcements",
				announcement_title: 1.0,
				announcement_description: 1.0,
				announcement_deadline: 1.0,
				bgcolor: 1.0,
				month: 1.0,
			},
		},
		{
			$match: {
				month: monthSelected,
			},
		},
		{
			$group: {
				_id: {
					$dayOfMonth: "$announcement_deadline",
				},
				announcements: {
					$push: {
						class_name: "$class_name",
						announcement_title: "$announcement_title",
						announcement_description: "$announcement_description",
						bgcolor: "$bgcolor",
						month: "$month",
						classes_id: "$classes_id",
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

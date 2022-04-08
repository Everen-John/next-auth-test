import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageData(req, res) {
	let monthSelected = req.body.month
	let yearSelected = req.body.year
	let user = req.body.user
	console.log(monthSelected, yearSelected, user)

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
			$project: {
				intakes_joined: 1.0,
				intakes_taught: 1.0,
			},
		},
		{
			$facet: {
				facet_res: [
					{
						$lookup: {
							from: "intakes",
							localField: "intakes_joined",
							foreignField: "_id",
							as: "intakes_joined_data",
						},
					},
					{
						$lookup: {
							from: "intakes",
							localField: "intakes_taught",
							foreignField: "_id",
							as: "intakes_taught_data",
						},
					},
				],
			},
		},
		{
			$project: {
				_id: 0.0,
				intakes_joined_data: {
					$first: "$facet_res.intakes_joined_data",
				},
				intakes_taught_data: {
					$first: "$facet_res.intakes_taught_data",
				},
			},
		},
		{
			$addFields: {
				"intakes_joined_data.createdIntake": false,
				"intakes_taught_data.createdIntake": true,
			},
		},
		{
			$project: {
				intakeData: {
					$concatArrays: ["$intakes_joined_data", "$intakes_taught_data"],
				},
			},
		},
		{
			$unwind: {
				path: "$intakeData",
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$unwind: {
				path: "$intakeData.announcement_oIDs",
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$addFields: {
				announcements: {
					announcement_oID: "$intakeData.announcement_oIDs",
					createdIntake: "$intakeData.createdIntake",
				},
			},
		},
		{
			$project: {
				intakeData: 1,
				announcements: 1,
				_id: 0,
			},
		},
		{
			$lookup: {
				from: "Announcements",
				localField: "announcements.announcement_oID",
				foreignField: "_id",
				as: "announcementData",
			},
		},
		{
			$project: {
				intakeData: 1,
				announcement_oID: "$announcements.announcement_oID",
				createdIntake: "$announcements.createdIntake",
				announcementData: {
					$first: "$announcementData",
				},
			},
		},
		{
			$lookup: {
				from: "class",
				foreignField: "_id",
				localField: "intakeData.class_oID",
				as: "classData",
			},
		},
		{
			$unwind: {
				path: "$classData",
			},
		},
		{
			$project: {
				class_name: "$classData.class_name",
				intake_name: "$intakeData.intake_name",
				intake_id: "$intakeData._id",
				class_id: "$classData._id",
				announcement_id: "$announcementData._id",
				announcement_title: "$announcementData.announcement_Title",
				announcement_description: "$announcementData.announcement_description",
				bgcolor: "$announcementData.bgcolor",
				publish_time: "$announcementData.publish_time",
				month: {
					$month: {
						date: "$announcementData.publish_time",
					},
				},
				year: {
					$year: "$announcementData.publish_time",
				},
				createdIntake: 1,
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
						createdIntake: "$createdIntake",
						class_name: "$class_name",
						intake_name: "$intake_name",
						announcement_title: "$announcement_title",
						announcement_description: "$announcement_description",
						bgcolor: "$bgcolor",
						month: "$month",
						intake_id: "$intake_id",
						announcement_id: "$announcement_id",
						class_id: "$class_id",
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

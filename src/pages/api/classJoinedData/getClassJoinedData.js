import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageData(req, res) {
	let monthSelected = req.body.month
	let user = req.body.user
	let intakeid = req.body.intakeid

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
				student_oIDs: 1.0,
				teacher_oIDs: 1.0,
				quiz_oIDs: 1.0,
				content_oIDs: 1.0,
				files_oIDs: 1.0,
				announcement_oIDs: 1.0,
				intake_code: 1.0,
				intake_name: 1.0,
				date_created: 1.0,
			},
		},
		{
			$facet: {
				GeneralData: [
					{
						$project: {
							date_created: 1.0,
							student_oIDs: 1.0,
							teacher_oIDs: 1.0,
							intake_code: 1.0,
							intake_name: 1.0,
						},
					},
				],
				Quizes: [
					{
						$project: {
							quiz_oIDs: 1.0,
						},
					},
					{
						$unwind: {
							path: "$quiz_oIDs",
						},
					},
					{
						$lookup: {
							from: "quizes",
							localField: "quiz_oIDs",
							foreignField: "_id",
							as: "quizDatas",
						},
					},
					{
						$unwind: {
							path: "$quizDatas",
						},
					},
					{
						$addFields: {
							type: "quiz",
							publish_time: "$quizDatas.publish_time",
						},
					},
				],
				contents: [
					{
						$project: {
							content_oIDs: 1.0,
						},
					},
					{
						$unwind: {
							path: "$content_oIDs",
						},
					},
					{
						$lookup: {
							from: "contents",
							localField: "content_oIDs",
							foreignField: "_id",
							as: "contentDatas",
						},
					},
					{
						$unwind: {
							path: "$contentDatas",
						},
					},
					{
						$addFields: {
							type: "content",
							publish_time: "$contentDatas.publish_time",
						},
					},
				],
				Files: [
					{
						$project: {
							files_oIDs: 1.0,
						},
					},
					{
						$unwind: {
							path: "$files_oIDs",
						},
					},
					{
						$lookup: {
							from: "files",
							localField: "files_oIDs",
							foreignField: "_id",
							as: "filesDatas",
						},
					},
					{
						$unwind: {
							path: "$filesDatas",
						},
					},
					{
						$addFields: {
							type: "files",
							publish_time: "$filesDatas.publish_time",
						},
					},
				],
				Announcements: [
					{
						$project: {
							announcement_oIDs: 1.0,
						},
					},
					{
						$unwind: {
							path: "$announcement_oIDs",
						},
					},
					{
						$lookup: {
							from: "Announcements",
							localField: "announcement_oIDs",
							foreignField: "_id",
							as: "announcementDatas",
						},
					},
					{
						$unwind: {
							path: "$announcementDatas",
						},
					},
					{
						$addFields: {
							type: "announcement",
							publish_time: "$announcementDatas.publish_time",
						},
					},
				],
			},
		},
		{
			$unwind: {
				path: "$GeneralData",
			},
		},
		{
			$project: {
				GeneralData: 1.0,
				Items: {
					$concatArrays: ["$Quizes", "$contents", "$Files", "$Announcements"],
				},
			},
		},
		{
			$unwind: {
				path: "$Items",
			},
		},
		{
			$group: {
				_id: {
					$week: "$Items.publish_time",
				},
				generalData: {
					$first: "$GeneralData",
				},
				publish_estimate: {
					$first: "$Items.publish_time",
				},
				items: {
					$push: "$Items",
				},
			},
		},
		{
			$addFields: {
				dayOfWeek: {
					$subtract: [
						{
							$dayOfWeek: "$publish_estimate",
						},
						1.0,
					],
				},
			},
		},
		{
			$project: {
				generalData: 1.0,
				items: 1.0,
				weekNumber: "$_id",
				yearNumber: {
					$year: "$publish_estimate",
				},
				monthNumber: {
					$month: "$publish_estimate",
				},
				firstDayOfWeek: {
					$subtract: [
						"$publish_estimate",
						{
							$multiply: ["$dayOfWeek", 24.0, 3600000.0],
						},
					],
				},
				lastDayOfWeek: {
					$add: [
						"$publish_estimate",
						{
							$multiply: [
								{
									$subtract: [6.0, "$dayOfWeek"],
								},
								24.0,
								3600000.0,
							],
						},
					],
				},
			},
		},
		{
			$sort: { _id: 1 },
		},
		{
			$group: {
				_id: "$yearNumber",
				generalData: {
					$first: "$generalData",
				},
				yearedData: {
					$push: {
						weekNumber: "$weekNumber",
						monthNumber: "$monthNumber",
						firstDayOfWeek: "$firstDayOfWeek",
						lastDayOfWeek: "$lastDayOfWeek",
						weekItems: "$items",
					},
				},
			},
		},
		{
			$sort: {
				_id: 1.0,
			},
		},
		{
			$group: {
				_id: "$generalData",
				yearlyItems: {
					$push: {
						year: "$_id",
						yearedData: "$yearedData",
					},
				},
			},
		},
	]

	var cursor = await collection.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	res.status(200).json(finalData[0])
}

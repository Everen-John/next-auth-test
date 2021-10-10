import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getHomePageData(req, res) {
	let monthSelected = req.body.month
	let user = req.body.user
	let classid = req.body.classid

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
				student_oIDs: 1,
				teacher_oIDs: 1,
				quiz_oIDs: 1,
				content_oIDs: 1,
				files_oIDs: 1,
				announcement_oIDs: 1,
				intake_code: 1,
				intake_name: 1,
				date_created: 1,
			},
		},
		{
			$facet: {
				GeneralData: [
					{
						$project: {
							date_created: 1,
							student_oIDs: 1,
							teacher_oIDs: 1,
							intake_code: 1,
							intake_name: 1,
						},
					},
				],
				Quizes: [
					{
						$project: {
							quiz_oIDs: 1,
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
				Contents: [
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
						$lookup: {
							from: "Contents",
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
							files_oIDs: 1,
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
							announcement_oIDs: 1,
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
				GeneralData: 1,
				Items: {
					$concatArrays: ["$Quizes", "$Contents", "$Files", "$Announcements"],
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
						1,
					],
				},
			},
		},
		{
			$project: {
				generalData: 1,
				items: 1,
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
							$multiply: ["$dayOfWeek", 24, 3600000],
						},
					],
				},
				lastDayOfWeek: {
					$add: [
						"$publish_estimate",
						{
							$multiply: [
								{
									$subtract: [6, "$dayOfWeek"],
								},
								24,
								3600000,
							],
						},
					],
				},
			},
		},
		{
			$sort: {
				yearNumber: -1,
				monthNumber: 1,
				weekNumber: 1,
			},
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
	console.log("Hi!")
	console.log(finalData)
	res.status(200).json(finalData[0])
}

import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getQuizData(req, res) {
	let intakeid = req.body.intakeid
	let userid = req.body.userid
	let quizid = req.body.quizid

	console.log("intakeid", intakeid)
	console.log("userid", userid)
	console.log("quizid", quizid)

	const client = await clientPromise

	var db = await client.db(process.env.DATABASE_NAME)
	var options = {}

	return new Promise(async (resolve, reject) => {
		let userAllowed = await checkIfUserIsTeacher(db, options, {
			userid,
			intakeid,
		})
		if (userAllowed) {
			resolve()
		} else {
			reject()
		}
	})
		.then(async () => {
			let res = await getQuizDocument(db, options, { quizid })
			return res
		})
		.then((results) => {
			res.status(200).json(results)
		})
}

const checkIfUserIsTeacher = async (db, options, { userid, intakeid }) => {
	var intakesColl = await db.collection("intakes")
	var intakesPipeline = [
		{
			$match: {
				_id: new ObjectId(intakeid),
				teacher_oIDs: new ObjectId(userid),
			},
		},
	]
	var cursor = await intakesColl.aggregate(intakesPipeline, options)
	let finalData = await cursor.toArray()

	if (finalData.length > 0) {
		return true
	} else {
		return false
	}
}

const getQuizDocument = async (db, options, { quizid }) => {
	var quizesColl = await db.collection("quizes")

	var pipeline = [
		{
			$match: {
				_id: new ObjectId(quizid),
			},
		},
	]

	var cursor = await quizesColl.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	return finalData[0]
}

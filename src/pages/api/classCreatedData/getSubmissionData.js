import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function getQuizData(req, res) {
	let intakeid = req.body.intakeid
	let userid = req.body.userid
	let submissionid = req.body.submissionid

	console.log("intakeid", intakeid)
	console.log("userid", userid)
	console.log("submissionid", submissionid)
	// res.status(200).json({ msg: "ok" })

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
			let res = await getSubmissionDocument(db, options, { submissionid })
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

const getSubmissionDocument = async (db, options, { submissionid }) => {
	var submissionsColl = await db.collection(process.env.submissions_coll)

	var pipeline = [
		{
			$match: {
				_id: new ObjectId(submissionid),
			},
		},
	]

	var cursor = await submissionsColl.aggregate(pipeline, options)
	var finalData = await cursor.toArray()
	return finalData[0]
}

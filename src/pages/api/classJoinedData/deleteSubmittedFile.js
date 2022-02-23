import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"
import AWS from "aws-sdk"

export default async function getHomePageData(req, res) {
	let userid = req.body.userid
	let fileData = req.body.fileData
	let submissionid = req.body.submissionid
	let intakeid = req.body.intakeid

	console.log("userid", userid)
	console.log("fileData", fileData)
	console.log("submissionid", submissionid)
	return new Promise(async (resolve, reject) => {
		let recordDeletion = deleteRecordFromMongoDB({
			userid,
			fileData,
			submissionid,
			intakeid,
		})
			.then(async () => {
				let fileDeletion = await deleteFileFromS3({ fileData })
				return
			})
			.then(() => {
				res.status(200).json({ msg: "ok" })
			})
			.catch(() => {
				reject({ msg: "failed" })
			})
	})
}

const deleteRecordFromMongoDB = async ({ fileData, submissionid }) => {
	return new Promise(async (resolve, reject) => {
		const client = await clientPromise

		// // Step 1: Start a Client Session
		const session = await client.startSession()
		// // Step 2: Optional. Define options to use for the transaction
		const transactionOptions = {
			readPreference: "primary",
			readConcern: { level: "local" },
			writeConcern: { w: "majority" },
		}

		try {
			await session.withTransaction(async () => {
				const submissionsColl = client
					.db(process.env.DATABASE_NAME)
					.collection(process.env.submissions_coll)
				// Important:: You must pass the session to the operations

				let submissionsData = await submissionsColl.updateOne(
					{ _id: new ObjectId(submissionid) },
					{
						$pull: {
							submitters: { key: fileData.key },
						},
					},
					{ session }
				)
				console.log(submissionsData)
			}, transactionOptions)
			resolve({ msg: "ok" })
		} catch (e) {
			console.log(e)
			reject({ msg: "failed" })
		} finally {
		}
	})
}

const deleteFileFromS3 = async ({ fileData }) => {
	return new Promise(async (resolve, reject) => {
		let s3 = new AWS.S3({
			accessKeyId: process.env.ACCESS_KEY,
			secretAccessKey: process.env.SECRET_KEY,
			region: process.env.REGION,
		})
		let params = {
			Bucket: process.env.BUCKET_NAME,
			Key: fileData.key,
		}

		s3.deleteObject(params, function (err, data) {
			if (err) {
				console.log(err, err.stack)
				reject({ msg: "failed" })
			} else {
				console.log(data)
				resolve({ msg: "ok" })
			}
		})
	})
}

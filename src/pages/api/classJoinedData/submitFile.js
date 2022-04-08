import { ObjectId } from "bson"
import formidable from "formidable"
import { resolve } from "path"
import { isContext } from "vm"

import clientPromise from "../../../lib/mongodb"
const aws = require("aws-sdk")
const multerS3 = require("multer-s3")
const fs = require("fs")
const path = require("path")

export const config = {
	api: {
		bodyParser: false,
	},
}

export default async function submitFile(req, res) {
	const form = new formidable.IncomingForm()
	form.uploadDir = "/tmp/"
	form.keepExtensions = true

	var items = await new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) {
				reject(err)
				return
			}

			resolve({ fields, files })
		})
	})
		.then((fileData) => {
			return fileData
		})
		.then((fileData) => {
			let fileName = designName(fileData)
			return { fileData, fileName }
		})
		.then(({ fileData, fileName }) => uploadToS3(fileData, fileName))
		.then((S3Results) => {
			console.log("At S3 Results")
			console.log(S3Results)
			console.log("Fields", S3Results.fields)
			uploadFileDataToMongoDB(S3Results)
		})
		.catch((e) => {
			res.status()
		})

	res.status(200).send()
}

const designName = (fileData) => {
	let namingConvention = JSON.parse(fileData.fields.namingConvention)

	for (let i = 0; i < namingConvention.length; i++) {
		switch (namingConvention[i]) {
			case "__NAME__":
				namingConvention[i] = fileData.fields.user_name
				break
			case "__DATE__":
				namingConvention[i] = new Date()
					.toISOString()
					.replace(/T/, " ") // replace T with a space
					.replace(/\..+/, "")
				break
			default:
				break
		}
	}
	return namingConvention.join(" ")
}

const uploadToS3 = async (fileData, fileName) => {
	let s3 = new aws.S3({
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRET_KEY,
		region: process.env.REGION,
	})

	return new Promise(async (resolve, reject) => {
		let dateOfNow = new Date().toLocaleString("en-GB")
		const fileStream = fs.createReadStream(`${fileData.files.media.path}`)
		const S3Params = {
			Bucket: `${process.env.BUCKET_NAME}/public/${fileData.fields.intake_oID}/submissionBank/${fileData.fields.submission_oID}/${fileData.fields.user_oID}`,
			Body: fileStream,
			Key: `${fileName}${path.extname(fileData.files.media.name)}`,
		}
		var results = await s3.upload(S3Params).promise()
		resolve({ fields: fileData.fields, results, fileName })
	})
}

const uploadFileDataToMongoDB = async (S3Results) => {
	const client = await clientPromise
	console.log(S3Results)

	// Step 1: Start a Client Session
	const session = await client.startSession()
	// Step 2: Optional. Define options to use for the transaction
	const transactionOptions = {
		readPreference: "primary",
		readConcern: { level: "local" },
		writeConcern: { w: "majority" },
	}
	// Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
	// Note: The callback for withTransaction MUST be async and/or return a Promise.
	try {
		await session.withTransaction(async () => {
			const intakeColl = client
				.db(process.env.DATABASE_NAME)
				.collection(process.env.submissions_coll)
			const submissionsColl = client
				.db(process.env.DATABASE_NAME)
				.collection(process.env.submissions_coll)

			//PREPROCESSING THE TIME DATA
			console.log("S3 RESULTS FIELDS: ", S3Results.fields)

			// Important:: You must pass the session to the operations
			let submissions_data = await submissionsColl.updateOne(
				{ _id: ObjectId(S3Results.fields.submission_oID) },
				{
					$push: {
						submitters: {
							submitter_oID: ObjectId(S3Results.fields.user_oID),
							submitter_name: S3Results.fields.user_name,
							submittedLocation: S3Results.results.Location,
							key: S3Results.results.key,
							ETag: S3Results.results.ETag,
						},
					},
				},

				{ session }
			)
			console.log("SUBMISSIONDATA:", submissions_data)
		}, transactionOptions)
		return
	} catch (e) {
		console.log(e)
	} finally {
		await session.endSession()
	}
}

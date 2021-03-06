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

export default async function uploadFile(req, res) {
	const form = new formidable.IncomingForm()
	form.uploadDir = "./public/uploads/"
	form.keepExtensions = true

	var items = await new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) {
				reject(err)
				return
			}
			console.log(fields, files)
			resolve({ fields, files })
		})
	})
		.then((fileData) => uploadToS3(fileData))
		.then((S3Results) => {
			console.log("At S3 Results")
			console.log(S3Results)
			console.log("Fields", S3Results.fields)
			uploadFileDataToMongoDB(S3Results)
		})

	res.status(200).send()
}

const uploadToS3 = async (fileData) => {
	let s3 = new aws.S3({
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRET_KEY,
		region: process.env.REGION,
	})

	return new Promise(async (resolve, reject) => {
		let dateOfNow = new Date().toLocaleString("en-GB")
		const fileStream = fs.createReadStream(`${fileData.files.media.path}`)
		const S3Params = {
			Bucket: `${process.env.BUCKET_NAME}/public/${fileData.fields.in_intake_oID}/creator/`,
			Body: fileStream,
			Key: `${path.parse(fileData.files.media.name).name}_${dateOfNow.replace(
				/[^\w\s]/gi,
				""
			)}${path.extname(fileData.files.media.name)}`,
		}
		var results = await s3.upload(S3Params).promise()
		resolve({ fields: fileData.fields, results })
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
				.collection("intakes")
			const filesColl = client.db(process.env.DATABASE_NAME).collection("files")

			//PREPROCESSING THE TIME DATA
			console.log("S3 RESULTS FIELDS: ", S3Results.fields)
			let published_time_arr = S3Results.fields.publish_time.split("/")
			let published_time_new = `${published_time_arr[1]}-${published_time_arr[0]}-${published_time_arr[2]}`

			// Important:: You must pass the session to the operations
			let files_data = await filesColl.insertOne(
				{
					in_intake_oID: new ObjectId(S3Results.fields.in_intake_oID),
					file_location: S3Results.results.Location,
					publish_time: new Date(published_time_new),
					file_deadline: new Date(S3Results.fields.file_deadline),
					file_title: S3Results.fields.title,
					file_description: S3Results.fields.description,
					real_name: S3Results.fields.name,
					type: S3Results.fields.type,
				},
				{ session }
			)
			console.log("FilesData: ", files_data.insertedId)
			let intakeData = await intakeColl.updateOne(
				{ _id: new ObjectId(S3Results.fields.in_intake_oID) },
				{ $push: { files_oIDs: new ObjectId(files_data.insertedId) } },
				{ session }
			)
			console.log(intakeData)
		}, transactionOptions)
	} catch (e) {
		console.log(e)
	} finally {
		await session.endSession()
		resolve()
	}
}

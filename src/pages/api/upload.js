// const aws = require("aws-sdk")
// const multer = require("multer")
// const multerS3 = require("multer-s3")

// aws.config.update({
// 	region: process.env.REGION,
// 	accessKeyId: process.env.ACCESS_KEY,
// 	secretAccessKey: process.env.SECRET_KEY,
// })
// let s3 = new aws.S3()

// let storage = multerS3({
// 	s3: s3,
// 	bucket: process.env.BUCKET_NAME,
// 	metadata: (req, file, cb) => {
// 		cb(null, { fieldName: file.fieldname })
// 	},
// 	key: (req, file, cb) => {
// 		const filename = `${Date.now()}${path.extname(file.originalname)}`
// 		cb(null, filename)
// 	},
// })

// let upload = multer({
// 	storage: storage,
// })

// export default async function handler(req, res) {
// 	await upload.array("media")(req, {}, (err) => {
// 		// do error handling here
// 		console.log(req) // do something with the files here
// 	})
// 	res.status(200).send({})
// }

import formidable from "formidable"
import { resolve } from "path"
const aws = require("aws-sdk")
const multerS3 = require("multer-s3")
const fs = require("fs")
const path = require("path")

let s3 = new aws.S3({
	accessKeyId: process.env.ACCESS_KEY,
	secretAccessKey: process.env.SECRET_KEY,
	region: process.env.REGION,
})

export const config = {
	api: {
		bodyParser: false,
	},
}

export default async (req, res) => {
	const form = new formidable.IncomingForm()
	form.uploadDir = "./public/uploads/"
	form.keepExtensions = true

	let results = await form.parse(req, (err, fields, files) => {
		// // console.log("fields:", fields)
		// console.log("files:", files.media.path)
		// file = files.media.path
		resolve()
	})
	console.log(fields)
	// await uploadToS3(file)
	res.status(200).send({ msg: "File Uploaded to S3!" })
}

const uploadToS3 = (file) => {
	const fileStream = fs.createReadStream(file.path)
	const S3Params = {
		Bucket: process.env.BUCKET_NAME,
		Body: fileStream,
		Key: path.basename(file.path),
	}

	return s3.upload(S3Params).promise()
}

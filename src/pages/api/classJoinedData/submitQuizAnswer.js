import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "bson"

export default async function submitQuizAnswer(req, res) {
	let userid = req.body.user
	let quizid = req.body.quizid
	let intakeid = req.body.intakeid
	let answerSheet = req.body.answerSheet
	let completionTimeLeft = req.body.completionTime

	console.log("user", userid)
	console.log("intakeid", intakeid)
	console.log("quizid", quizid)
	console.log("answerSheet", answerSheet)
	const client = await clientPromise

	var db = await client.db(process.env.DATABASE_NAME)

	let correctAnswers = await getCorrectAnswers({
		db,
		userid,
		quizid,
		answerSheet,
	})
		.then(async (res) => {
			console.log("correctAnswers", res)
			let quizAttempterReportObject = performComparison({
				answerSheet,
				actualAnswers: res.answers,
				completionTime: res.completionTime,
				userid: userid,
				completionTimeLeft,
			})
			console.log("quizAttempterReportObject", quizAttempterReportObject)
			let quizCollData = await insertAttemptOntoQuiz(
				quizAttempterReportObject,
				quizid
			)
			return quizCollData
		})
		.then((res) => console.log(res))

	res.status(200).send({ msg: "ok" })
}

const getCorrectAnswers = async ({ db, userid, quizid, answerSheet }) => {
	return new Promise(async (resolve, reject) => {
		var collection = await db.collection("quizes")

		var options = {}

		var pipeline = [
			{
				$match: {
					_id: new ObjectId(quizid),
				},
			},
			{
				$project: {
					answers: 1,
					completionTime: 1,
				},
			},
		]

		var cursor = await collection.aggregate(pipeline, options)
		var correctAnswers = await cursor.toArray()
		resolve(correctAnswers[0])
	})
}

const performComparison = ({
	answerSheet,
	actualAnswers,
	completionTime,
	userid,
	completionTimeLeft,
}) => {
	let tempAnswerSheet = JSON.parse(JSON.stringify(answerSheet))
	let tempActualAnswers = JSON.parse(JSON.stringify(actualAnswers)).filter(
		(item) => !(item.type === "essay")
	)
	let totalScorePerQuestion = 100 / tempActualAnswers.length
	let attempterScore = 0

	let checkboxScorePerAnswer
	let fitbScorePerAnswer

	tempActualAnswers.map((item, key) => {
		console.log(item.type)
		switch (item.type) {
			case "radio":
				console.log("Is Radio!")
				if (item.answers === tempAnswerSheet[key].answers) {
					attempterScore += totalScorePerQuestion
					console.log("Radio is correct")
				} else {
					console.log("Radio is incorrect")
				}
				break
			case "fitb":
				console.log("Is FITB!")
				fitbScorePerAnswer = totalScorePerQuestion / item.answers.length
				item.answers.map((nestedItem, j) => {
					if (nestedItem === tempAnswerSheet[key].answers[j]) {
						attempterScore += fitbScorePerAnswer
						console.log(
							"FITB score is correct",
							nestedItem,
							" ",
							tempAnswerSheet[key].answers[j]
						)
					} else {
						console.log(
							"FITB score is incorrect",
							nestedItem,
							" ",
							tempAnswerSheet[key].answers[j]
						)
					}
				})
				break
			case "checkbox":
				console.log("Is Checkbox!")
				checkboxScorePerAnswer = totalScorePerQuestion / item.answers.length
				let checkboxScore = 0
				const similarities = item.answers.filter((value) =>
					tempAnswerSheet[key].answers.includes(value)
				)
				const nonSimilarities = tempAnswerSheet[key].answers.filter(
					(value) => !item.answers.includes(value)
				)
				console.log("similarities", similarities)
				console.log("nonSimilarities", nonSimilarities)
				similarities.forEach((element) => {
					checkboxScore += checkboxScorePerAnswer
				})
				nonSimilarities.forEach((element) => {
					checkboxScore -= checkboxScorePerAnswer
				})
				if (checkboxScore < 0) {
					checkboxScore = 0
				}
				attempterScore += checkboxScore

				break
			case "essay":
				console.log("Is Essay!")
				console.log("Essay, score not ca[0].answerslculated")
				break
			default:
				console.log("Unknown Question Type.")
		}
	})
	console.log("Attempter Score", attempterScore, "%")
	let quizAttempterObject = {
		attempter_oID: userid,
		score: parseFloat(attempterScore.toFixed(2)),
		attempter_answers: tempAnswerSheet,
		completedAfter: parseFloat(
			(completionTime - completionTimeLeft).toFixed(2)
		),
		completedDate: new Date(),
	}

	return quizAttempterObject
}

const insertAttemptOntoQuiz = async (quizAttemptReportObject, quizid) => {
	return new Promise(async (resolve, reject) => {
		const client = await clientPromise
		// Step 1: Start a Client Session
		const session = client.startSession()
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
				const quizesColl = client
					.db(process.env.DATABASE_NAME)
					.collection("quizes")
				// Important:: You must pass the session to the operations
				let quizesColl_data = await quizesColl.updateOne(
					{ _id: ObjectId(quizid) },
					{
						$push: {
							attempters: quizAttemptReportObject,
						},
					},
					{ session }
				)
				resolve(quizesColl_data)
			}, transactionOptions)
		} finally {
		}
	})
}

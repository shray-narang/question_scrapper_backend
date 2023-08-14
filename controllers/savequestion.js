const savequestion = require('express').Router()

const fs = require('fs')
const Question = require('../Models/question')

savequestion.post('/', async (req, res) => {
  console.log('i ran')
  try {
    await Question.deleteMany({})
    const questionsData = JSON.parse(
      fs.readFileSync('./questions.json', 'utf8'),
    )
    console.log(questionsData)

    for (const questionData of questionsData) {
      const question = new Question({
        id: questionData.id,
        question_name: questionData.problem_name,
        slug: questionData.slug,
        difficulty: questionData.difficulty,
        tags: questionData.tags,
        question_url: questionData.problem_url,
        question_description: questionData.problem_description,
      })

      await question.save()
    }

    res.status(201).json({ message: 'Questions uploaded successfully' })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while uploading questions' })
  }
})

savequestion.get('/', async (req, res) => {
  try {
    const notes = await Question.find({})
    res.json(notes)
  } catch {
    console.log('keep coding')
  }
})

module.exports = savequestion

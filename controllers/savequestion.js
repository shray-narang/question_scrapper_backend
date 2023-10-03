const savequestion_leet = require('express').Router()

const fs = require('fs')
const Question = require('../Models/question')
const question = require('../Models/question')

savequestion_leet.post('/leet', async (req, res) => {
  console.log('i ran')
  try {
    const questionData = req.body // Assuming you are now receiving a single question

    // Find the existing question by problem_url
    const existingQuestion = await Question.findOne({
      problem_url: questionData.problem_url,
    })

    if (existingQuestion) {
      // Update the existing question
      const newCompanyTags = questionData.tags.company_tags.filter(
        newCompanyTag =>
          !existingQuestion.tags.company_tags.includes(newCompanyTag),
      )
      console.log(existingQuestion)
      console.log('^this is a test')
      existingQuestion.tags.company_tags =
        existingQuestion.tags.company_tags.concat(newCompanyTags)

      await existingQuestion.save()
    } else {
      // Create a new question if it doesn't exist
      const question = new Question({
        problem_name: questionData.problem_name,
        tags: {
          company_tags: questionData.tags.company_tags,
          topic_tags: questionData.tags.topic_tags,
        },
        problem_url: questionData.problem_url,
        problem_description: questionData.problem_description,
        problem_solution: questionData.problem_solution,
        acceptance: questionData.acceptance,
        difficulty: questionData.difficulty,
        frequency: questionData.frequency,
      })

      await question.save()
    }

    res.status(201).json({ message: 'Question uploaded successfully' })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while uploading the question' })
  }
})

savequestion_leet.post('/update_leet', async (req, res) => {
  try {
    // Update objects that don't already have 'sites'
    const updatedObjects = await Question.updateMany(
      {
        site: { $exists: false },
      },
      {
        $set: {
          site: 'leetcode',
          hints: 'defaultValueForHints',
        },
      },
    )
    res.json({ message: `${updatedObjects.nModified} objects updated` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

savequestion_leet.post('/gfg', async (req, res) => {
  console.log('i ran')
  try {
    const questionData = req.body // Assuming you are now receiving a single question

    // Find the existing question by problem_url
    const existingQuestion = await Question.findOne({
      problem_url: questionData.problem_url,
    })

    if (existingQuestion) {
      // Update the existing question
      const newCompanyTags = questionData.tags.company_tags.filter(
        newCompanyTag =>
          !existingQuestion.tags.company_tags.includes(newCompanyTag),
      )
      console.log(existingQuestion)
      console.log('^this is a test')
      existingQuestion.tags.company_tags =
        existingQuestion.tags.company_tags.concat(newCompanyTags)

      await existingQuestion.save()
      res.status(201).json({ message: 'Question already there' })
    } else {
      // Create a new question if it doesn't exist
      const question = new Question({
        hints: questionData.hints,
        site: 'gfg',
        problem_name: questionData.problem_name,
        tags: {
          company_tags: questionData.tags.company_tags,
          topic_tags: questionData.tags.topic_tags,
        },
        problem_url: questionData.problem_url,
        problem_description: questionData.problem_description,
        problem_solution: questionData.problem_solution,
        acceptance: questionData.acceptance,
        difficulty: questionData.difficulty,
        frequency: questionData.frequency,
      })

      await question.save()
      res.status(201).json({ message: 'Question uploaded successfully' })
    }
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while uploading the question' })
  }
})

savequestion_leet.get('/', async (req, res) => {
  try {
    const notes = await Question.find({})
    res.json(notes)
  } catch {
    console.log('keep coding')
  }
})

savequestion_leet.get('/checkQuestion', async (req, res) => {
  try {
    const { url } = req.query // Assuming you pass the URL as a query parameter

    // Use Mongoose to find a question by the provided URL
    const existingQuestion = await Question.findOne({ problem_url: url })

    if (existingQuestion) {
      // Question with the provided URL exists
      res.status(200).json(true)
    } else {
      // Question with the provided URL does not exist
      res.status(200).json(false)
    }
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while checking the question' })
  }
})

savequestion_leet.get('/search', async (req, res) => {
  const companyTags = req.query.companyTags

  const companyTagsArray = Array.isArray(companyTags)
    ? companyTags
    : [companyTags]
  console.log(companyTagsArray)

  try {
    const orConditions = companyTagsArray.map(tag => ({
      'tags.company_tags': { $regex: new RegExp(tag, 'i') },
    }))

    const query = {
      $or: orConditions,
    }

    const fieldsToInclude = 'id problem_name tags' // Replace with the fields you need
    const results = await question.find(query).select(fieldsToInclude)

    res.json(results)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

savequestion_leet.get('/companies', async (req, res) => {
  try {
    const companies = await question.aggregate([
      {
        $unwind: '$tags.company_tags',
      },
      {
        $group: {
          _id: '$tags.company_tags',
        },
      },
      {
        $project: {
          _id: 0,
          company: '$_id',
        },
      },
    ])

    const companyNames = companies.map(company => company.company)

    res.json(companyNames)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

savequestion_leet.post('/update', async (req, res) => {
  Question.collection.update(
    { defaulted: { $exists: false } },
    { $set: { defaulted: 0 } },
    { multi: true },
  )
})

module.exports = savequestion_leet

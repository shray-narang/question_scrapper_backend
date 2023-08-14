const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  id: Number,
  question_name: String,
  slug: String,
  difficulty: String,
  tags: {
    company_tags: [String],
    topic_tags: [String],
  },
  question_url: String,
  question_description: String,
})

const question = mongoose.model('question', questionSchema)

module.exports = question

const mongoose = require('mongoose')

const hintSchema = new mongoose.Schema({
  full_func: String,
  lang: String,
  lang_text: String,
})
const questionSchema_leet = new mongoose.Schema({
  site: String,
  id: String,
  problem_name: String,
  problem_url: String,
  tags: {
    company_tags: [String],
    topic_tags: [String],
  },
  problem_description: String,
  problem_solution: String,
  hints: [hintSchema],
  acceptance: String,
  difficulty: String,
  frequency: String,
})

const question = mongoose.model('question_leet', questionSchema_leet)

module.exports = question

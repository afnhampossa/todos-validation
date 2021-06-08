const mysql = require('mysql2')
const express = require('express')
const bodyParser = require('body-parser')

const { validate, validations } = require('indicative/validator')
const { sanitize } = require('indicative/sanitizer')

const users = require('./users')
const todos = require('./todos')

const PORT = 3000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'A.n.g.e.l.21',
  database: 'notes_app',
})

connection.connect((error) => {
  if (error) {
    throw error
  }

  users(app, connection, validate,sanitize,validations)
  todos(app, connection, validate,sanitize,validations)

  app.get('/welcome', (req, res) => {
    const { name } = req.query

    res.send(`Welcome ${name} :)`)
  })

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
})

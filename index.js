// EXPRESS FRAMEWORK FOR NODE.JS
const express = require('express')
const app = express()

// MIDDLEWARE CORS (Cross-Origin Resource Sharing) FOR ALLOW CROSS-ORIGIN REQUESTS
const cors = require('cors')
app.use(cors())

// EXPRESS JSON-PARSER FOR ACCESS DATA EASILY (creates body property)
app.use(express.json())

// MIDDLEWARE MORGAN FOR LOGGING MESSAGES TO THE CONSOLE
const morgan = require('morgan')

morgan.token("info", (req, res) => {
  const { body } = req
  return JSON.stringify(body)
})

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :info")
)

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})

// PEOPLE ARRAY
let people = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// RESPONSES TO THE REQUESTS (ROUTES)

app.get('/', (request, response) => {
  response.send('<h1>PHONEBOOK</h1><h2>FULL STACK OPEN PART 3</h2><h3>Exercise by <a href="https://github.com/Sigolletes" target="blank"><em>Sigolletes</em></a></h3>')
})

app.get('/info', (request, response) => {
  let date = new Date
  response.send(`<h3>This Phonebook has information for ${people.length} people</h3><h3>${date}</h3>`)
})

app.get('/api/people', (request, response) => {
  response.json(people)
})

app.get('/api/people/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = people.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  let num
  do {
    num = Math.floor(Math.random() * 10000)
  } while (people.some(p => p.id === num))
  return num
}

app.post('/api/people', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number missing' 
    })
  }
  if (people.some(p => p.name === body.name)) {
    return response.status(400).json({ 
      error: 'This name already exists in the phonebook' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  people = people.concat(person)
  response.json(person)
})

app.delete('/api/people/:id', (request, response) => {
  const id = Number(request.params.id)
  people = people.filter(person => person.id !== id)
  response.status(204).end()
})

// THE WEB SERVER CREATED WITH EXPRESS (APP) IS ASSIGNED TO A PORT AND RESPOND TO THE REQUESTS OF THAT PORT
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

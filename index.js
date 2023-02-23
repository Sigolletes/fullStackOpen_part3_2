/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
// DOTENV
require('dotenv').config();

// MIDDLEWARE MORGAN CALL
const morgan = require('morgan');

// MIDDLEWARE CORS CALL
const cors = require('cors');

// MIDDLEWARE EXPRESS CALL
const express = require('express');

// IMPORT MODULE person.js
const Person = require('./models/person');

// EXPRESS FRAMEWORK FOR NODE.JS
const app = express();

// MIDDLEWARE CORS (Cross-Origin Resource Sharing) FOR ALLOW CROSS-ORIGIN REQUESTS
app.use(cors());

// MIDDLEWARE STATIC FROM EXPRESS FOR SHOW INDEX.HTML FROM BUILD
// FOLDER IF THE GET REQUEST ADDRESS CORRESPOND TO
// www.example.com/index.html OR www.example.com
app.use(express.static('build'));

// EXPRESS JSON-PARSER FOR ACCESS DATA EASILY (creates body property)
app.use(express.json());

// MIDDLEWARE MORGAN FOR LOGGING MESSAGES TO THE CONSOLE
morgan.token('info', (req, res) => {
  const { body } = req;
  return JSON.stringify(body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :info'),
);

morgan((tokens, req, res) => [
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
].join(' '));

// // PEOPLE ARRAY
// let people = [
//   {
//     'id': 1,
//     'name': 'Arto Hellas',
//     'number': '040-123456'
//   },
//   {
//     'id': 2,
//     'name': 'Ada Lovelace',
//     'number': '39-44-5323523'
//   },
//   {
//     'id': 3,
//     'name': 'Dan Abramov',
//     'number': '12-43-234345'
//   },
//   {
//     'id': 4,
//     'name': 'Mary Poppendieck',
//     'number': '39-23-6423122'
//   }
// ];

// RESPONSES TO THE REQUESTS (ROUTES)
app.get('/', (request, response) => {
  response.send('<h1>PHONEBOOK</h1><h2>FULL STACK OPEN PART 3</h2><h3>Exercise by <a href="https://github.com/Sigolletes" target="blank"><em>Sigolletes</em></a></h3>');
});

app.get('/info', (request, response) => {
  const date = new Date();

  Person.count({}, (error, result, next) => {
    if (error) {
      next(error);
    } else {
      response.send(`<h3>This Phonebook has information for ${result} people</h3><h3>${date}</h3>`);
    }
  });
});

app.get('/api/people', (request, response, next) => {
  Person.find({}).then((people) => {
    response.json(people);
  })
    .catch((error) => next(error));
});

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// const generateId = () => {
//   let num
//   do {
//     num = Math.floor(Math.random() * 10000)
//   } while (people.some(p => p.id === num))
//   return num
// }

app.post('/api/people', (request, response, next) => {
  const { body } = request;

  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing',
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'Number missing',
    });
  }
  // if (people.some(p => p.name === body.name)) {
  //   return response.status(400).json({
  //     error: 'This name already exists in the phonebook'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  })
    .catch((error) => next(error));
});

app.put('/api/people/:id', (request, response, next) => {
  const { name, number } = request.body;

  // const person = {
  //   name: body.name,
  //   number: body.number,
  // }

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// MIDDLEWARE FOR CATCHING REQUESTS MADE TO NON-EXISTENT ROUTES (it has to be after routes)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown Endpoint' });
};
app.use(unknownEndpoint);

// ERROR HANDLER MIDDLEWARE
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

// THE WEB SERVER CREATED WITH EXPRESS (APP) IS ASSIGNED TO A PORT AND RESPOND
// TO THE REQUESTS OF THAT PORT
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

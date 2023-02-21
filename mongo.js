/* // PRACTICE APPLICATION - node mongo.js password

// LIBRARY MONGOOSE (high-level API) IS AN ODM (Object Document Mapper) for saving JS objects as Mongo documents
const mongoose = require('mongoose')

// CONDITION FOR THE PASSWORD
if (process.argv.length < 3) {
  console.log('Give password as argument')
  process.exit(1)
}

// ACCESS COMMAND LINE PARAMETER FOR GET THE PASSWORD
const password = process.argv[2]

// MongoDB URI
const url =
  `mongodb+srv://Aname:${password}@cluster0.md7ambl.mongodb.net/phonebook?retryWrites=true&w=majority`

// CONNECTION TO MongoDB
mongoose.set('strictQuery',false)
mongoose.connect(url)

// DEFINE THE SCHEMA FOR Person (tells Mongoose how the Person objects are to be stored in the database) AND THE MATCHING MODEL
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Person MODEL DEFINITION (The name of the collection will be the lowercase plural people) (Models are so-called constructor functions that create new JavaScript objects based on the provided parameters)
const Person = mongoose.model('Person', personSchema)

// DISPLAY PHONEBOOK TO THE CONSOLE
if (process.argv.length < 5) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

// ADD NEW PERSON FROM THE CONSOLE
if (process.argv.length > 4) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`Added: ${person.name} || Number: ${person.number} to Phonebook`)
    mongoose.connection.close()
  })
}

// ##########################################################

// // CREATE A NEW PERSON OBJECT WITH THE HELP OF Person MODEL
// const person = new Person({
//   name: "Aname",
//   number: "888-5555",
// })

// // SAVE THE OBJECT TO THE DATABASE
// person.save().then(result => {
//   console.log('person saved!', result)
//   mongoose.connection.close() // (If the connection is not closed, the program will never finish its execution)
// })

// ##########################################################

// // CREATE AND SAVE SEVERAL PERSONS
// let peopleArray = [
//   {
//     name: "Sara",
//     number: "888-2222",
//   },
//   {
//     name: "Clara",
//     number: "888-3333",
//   },
//   {
//     name: "Anna",
//     number: "888-4444",
//   }
// ]

// let manyPersons = function(peopleArray) {
//   Person.create(peopleArray, (error, docs) => {
//     if (error) {
//       console.log(error)
//       mongoose.connection.close()
//     } else {
//       console.log(docs)
//       mongoose.connection.close()
//     }
//   })
// }
// manyPersons(peopleArray)

// ##########################################################

// // PRINT ALL THE PEOPLE STORED IN THE DATABASE
// Person.find({}).then(result => {
//   result.forEach(person => {
//     console.log(person)
//   })
//   mongoose.connection.close()
// })

// ##########################################################
 */
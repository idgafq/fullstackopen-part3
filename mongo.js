require('dotenv').config()
const mongoose = require('mongoose')

/* global process */
const url = process.env.MONGO_URI

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema, 'persons')

mongoose.set('strictQuery', false)
const run = async () => {
	await mongoose.connect(url).catch((err) => console.log(err))
	console.log(mongoose.connection.readyState)

	if (process.argv.length === 2) {
		Person
			.find({})
			.then((persons) => {
				console.log('phonebook:')
				persons.forEach((person) => {
					console.log(`${person.name} ${person.number}`)
				})
				mongoose.connection.close()
			})
	}

	if (process.argv.length === 4) {
		const person = new Person({
			name: process.argv[2],
			number: process.argv[3]
		})
		person
			.save()
			.then(() => {
				console.log(`added ${person.name} number ${person.number} to phonebook`)
				mongoose.connection.close()
			})
	}
}
run()
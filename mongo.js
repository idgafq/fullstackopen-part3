const mongoose = require('mongoose')

/* global process */
if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema, 'persons')

mongoose.set('strictQuery', false)
const run = async () => {
	await mongoose.connect(url)
	console.log(mongoose.connection.readyState)

	if (process.argv.length === 3) {
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

	if (process.argv.length === 5) {
		const person = new Person({
			name: process.argv[3],
			number: process.argv[4]
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
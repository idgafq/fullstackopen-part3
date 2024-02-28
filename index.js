require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)
	}
	return ''
})

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then((persons) => {
		res.json(persons)
	})
})

app.get('/api/persons/:id', (req, res) => {
	Person.findById(req.params.id).then((person) => {
		res.json(person)
	})
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	//const person = persons.find((person) => person.id === id)
	const person = undefined
	if (person) {
    	persons = persons.filter((person) => person.id !== id)
		console.log(`Deleted ${person.name}`)
		res.statusMessage = `Deleted ${person.name}`
		return res.status(204).end()
	} else {
		res.statusMessage = `No match foudn for id ${id}`
		return res.status(204).end()
	}
})

app.post(`/api/persons`, (req, res) => {
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'name or number missing'
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})
	person.save().then((savedPerson) => {
		res.json(savedPerson)
	})
})

app.get('/info', (req, res) => {
    const time = new Date()
    res.send(
        `<p>
			Phonebook has info for ${Person.find({}).length} people<br />
            ${time}
        <p>`
    )
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
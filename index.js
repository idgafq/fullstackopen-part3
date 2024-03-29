require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)
	}
	return ''
})

const errorHandler = (err, req, res, next) => {
	console.error(err.message)
	if(err.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message })
	}
	next(err)
}

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

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndDelete(req.params.id)
		.then((data) => {
			if (data) {
				res.status(204).end()
			} else {
				res.status(404).end()
			}
		})
		.catch((err) => next(err))
})

app.post('/api/persons', (req, res, next) => {
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
	person
		.save()
		.then((savedPerson) => {
			res.json(savedPerson)
		})
		.catch((err) => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
	const { name, number } = req.body

	Person.findByIdAndUpdate(
		req.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: 'query' }
	)
		.then((updatedPerson) => {
			res.json(updatedPerson)
		})
		.catch((err) => next(err))
})

app.get('/info', (req, res, next) => {
	const time = new Date()
	Person.countDocuments({})
		.then((count) => {
			res.send(
				`<p>
					Phonebook has info for ${count} people<br />
					${time}
				</p>`
			)
		})
		.catch((err) => {
			res.send(`<p>${err.message}</p>`)
			next(err)
		})
})

app.use(errorHandler)

/* global process */
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
const express = require('express')
const morgan = require('morgan')

morgan.token('body', (req, res) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)
	}
	return ''
})

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find((person) => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find((person) => person.id === id)
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

	if (persons.find((person) => person.name === body.name)) {
		return res.status(400).json({
			error: 'name must be unique'
		})
	}

	const person = {
		name: body.name,
		number: body.number,
		id: getRandomInt(10000)
	}
	persons = persons.concat(person)
	res.json(person)
})

app.get('/info', (req, res) => {
    const time = new Date()
    res.send(
        `<p>
			Phonebook has info for ${persons.length} people<br />
            ${time}
        <p>`
    )
})

const getRandomInt = (max) => {
	return Math.floor(Math.random() * max)
}

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
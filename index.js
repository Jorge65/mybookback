const express = require('express')
const app = express()
var morgan = require('morgan')

let persons = [
    {
    "name": "Arto Hellaa",
    "number": "040-123456",
    "id": 1
    },
    {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
    },
    {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
    },
    {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
    },

]
app.use(express.static('build'))
app.use(express.json())

const cors = require('cors')
app.use(cors())

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//app.use(morgan('tiny'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!!</h1>')
  })
  
app.get('/info', (request, response) => {
    var d = new Date() 
    respText = `phonebook has info for ${persons.length} people <br>  ${d}`
    response.send(respText)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

morgan.token('newperson', function(req, res) {
  var name = req.body.name
  var number = req.body.number
  newperson = JSON.stringify( {"name": name, "number": number})
  return newperson 
  });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :newperson'))

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => {
      return p.id === id
    })

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
  id = Math.trunc(Math.random() * 1000000)
  return id
}


app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log('request.body',body);
  
  if (!body.name) {
    return response.status(400).json({ 
      error: 'person information missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number information missing' 
    })
  }

  var foundPersons = persons.filter(p => p.name === body.name)
  var len = foundPersons.length

  if (len > 0) { 
    return response.status(400).json({ 

      error: 'the name is already in phonebook' 
    })
  }


  const person = {
    name: body.name,
    number: body.number || false,
    id: generateId()
  }

  persons = persons.concat(person)
  response.json(person)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


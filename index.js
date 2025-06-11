require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
const Person = require('./models/persons');

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons);
  }).catch(err => next(err));
});
app.get('/info', (req, res) => {
  const date = new Date();
    const info = `<p>Phonebook has info for ${persons.length} people</p>
                    <p>${date}</p>`;
    res.send(info);
});
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(deletedPerson => {
      if (deletedPerson) {
        res.status(204).end();
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch(err => next(err));
});
app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }
  
  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if(existingPerson){
        return res.status(400).json({ error: 'name must be unique' });
      }

      const person = new Person({
        name: body.name,
        number: body.number
      });

      person.save()
        .then(savedPerson => {
          res.status(201).json(savedPerson);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch(err => next(err));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
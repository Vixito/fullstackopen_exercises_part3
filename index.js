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

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  }).catch(err => {
    console.error('Error fetching persons:', err);
    res.status(500).send('Internal Server Error');
  });
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

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(deletedPerson => {
      if (deletedPerson) {
        res.status(204).end();
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch(err => {
      console.error('Error deleting person:', err);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      res.status(201).json(savedPerson);
    })
    .catch(err => {
      console.error('Error saving person:', err);
      res.status(500).send('Internal Server Error');
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
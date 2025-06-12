// MongoDB connection setup
const mongoose = require('mongoose')
const password = process.argv[2]
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message)
  })

// Define the Person schema and model
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: true
  },
  number: {
    type: String,
    minlength: [8, 'Phone number must be at least 8 characters long'],
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v) // Debe tener el formato XX-XXXXXXX o XXX-XXXXXXXX
      },
      message: props => `${props.value} is not a valid phone number! Format must be XX-XXXXXXX or XXX-XXXXXXXX`
    }
  }
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', personSchema)
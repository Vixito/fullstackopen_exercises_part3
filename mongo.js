const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://Vixis:${password}@cluster0.0rdi6ay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
    // Listar todas las personas
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        });
        mongoose.connection.close();
    })
} else if (process.argv.length === 5){
    // Añadir una nueva persona
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Person({ name, number });

    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    }).catch(err => {
        console.error('Error adding person:', err);
        mongoose.connection.close();
    });
} else {
    console.log('usage:');
    console.log('node mongo.js <password> [name] [number]');
    mongoose.connection.close();    
}
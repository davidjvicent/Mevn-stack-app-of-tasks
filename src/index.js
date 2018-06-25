const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
mongoose.connect('mongodb://localhost/mevn-database')
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err))

//settings

app.set('port', process.env.PORT || 3000)

//middlewares

app.use(morgan('dev'))
app.use(express.json()) //body parser

//routes

app.use('/api/tasks', require('./routes/tasks.js'))

// static file

app.use(express.static(path.join(__dirname, 'public')))

//server is listening
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'))
})
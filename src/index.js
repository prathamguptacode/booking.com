require('dotenv').config()
const express=require('express')
const app = express()
app.use(express.json())
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/bookingcom').then(console.log('connected to the db'))

const mainRoute = require('./routes/main')
app.use('/api',mainRoute)

const auth=require('./auth/auth')
app.use('/api',auth)

const restrictedArea=require('./routes/restrictedArea')
app.use('/api',restrictedArea)

const refresh=require('./auth/refreshtoken')
app.use('/api',refresh)

app.listen(process.env.PORT,()=> console.log('hello world'))
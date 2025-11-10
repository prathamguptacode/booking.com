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

const addProperty=require('./routes/addProperty')
app.use('/api',addProperty)

const viewProperty=require('./routes/viewProperty')
app.use('/api',viewProperty)

const viewPropertybycity=require('./routes/viewPropertybycity')
app.use('/api',viewPropertybycity)

const viewPropertybyprice=require('./routes/viewPropertybyprice')
app.use('/api',viewPropertybyprice)

const viewPropertybytype=require('./routes/viewPropertybytype')
app.use('/api',viewPropertybytype)

const viewPropertybyname=require('./routes/viewPropertybyname')
app.use('/api',viewPropertybyname)

const cookies=require('./routes/cookie')
app.use('/api',cookies)

const review=require('./routes/review')
app.use('/api',review)

const comment=require('./routes/comment')
app.use('/api',comment)


app.listen(process.env.PORT,()=> console.log('hello world'))
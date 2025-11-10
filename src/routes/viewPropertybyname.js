const express = require('express')
const router = express()
const property = require('../models/propertySchema')

router.get('/viewpropertytbyname', async (req, res) => {
    try {
        if (!req.body?.name) return res.status(403).json({ message: 'please enter valid data' })
        const uname = req.body?.name;
        const name = uname.toLowerCase()
        const properties = await property.find({name: name})
        res.json({properties})

    } catch (error) {
        console.log('something went wrong in viewing property by name')
        console.error(error)
        res.status(500).json({ message: 'something went wrong in server', error })
    }
})

module.exports = router
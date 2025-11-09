const Property = require('../models/propertySchema')
const express = require('express')
const router = express.Router()


router.get('/viewpropertybycity', async (req, res) => {
    try {
        if (!req.body.city) return res.status(403).json({ message: 'please enter a city name' })
        const city = req.body.city;
        const properties = await Property.find({ city: city })
        res.json({ properties: properties })

    } catch (error) {
        console.log('something went wrong in viewing property by city')
        console.error(error)
        res.status(500).json({ message: 'something went wrong in server', error })
    }
})

module.exports = router
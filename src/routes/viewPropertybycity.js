const Property = require('../models/propertySchema')
const express = require('express')
const router = express.Router()


router.get('/viewpropertybycity', async (req, res) => {
    try {
        if (!req.body?.city) return res.status(403).json({ message: 'please enter a city name' })
        const tempcity = req.body.city;
        const city = tempcity.toLowerCase()
        const properties = await Property.where('city').equals(city).sort({review:-1})
        res.json({ properties: properties })

    } catch (error) {
        console.log('something went wrong in viewing property by city')
        console.error(error)
        res.status(500).json({ message: 'something went wrong in server', error })
    }
})

module.exports = router
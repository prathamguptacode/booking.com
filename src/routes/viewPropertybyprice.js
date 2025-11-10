const express = require('express')
const router = express()
const property = require('../models/propertySchema')

router.get('/viewHotelbyprice', async (req, res) => {
    try {
        if (!req.body?.lowestPrice) return res.status(403).json({ message: 'please enter valid data' })
        if (!req.body?.highestPrice) return res.status(403).json({ message: 'please enter valid data' })
        const low = req.body?.lowestPrice;
        const high = req.body?.highestPrice;
        const properties = await property.find({price: {$gt:low, $lte:high}})
        res.json({properties})

    } catch (error) {
        console.log('something went wrong in viewing property by price')
        console.error(error)
        res.status(500).json({ message: 'something went wrong in server', error })
    }
})

module.exports = router
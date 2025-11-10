const express = require('express')
const router = express()
const property = require('../models/propertySchema')

router.get('/viewpropertytbytype', async (req, res) => {
    try {
        if (!req.body?.type) return res.status(403).json({ message: 'please enter valid data' })
        const utype = req.body?.type;
        const type = utype.toLowerCase()
        const properties = await property.find({propertyType: type})
        res.json({properties})

    } catch (error) {
        console.log('something went wrong in viewing property by type')
        console.error(error)
        res.status(500).json({ message: 'something went wrong in server', error })
    }
})

module.exports = router
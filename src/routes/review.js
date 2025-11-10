const express = require('express')
const router = express.Router()
const Property = require('../models/propertySchema')
const jwt = require('jsonwebtoken')
require('dotenv').config()
let flag = 0;

router.post('/addingreview', async (req, res) => {
    try {

        const hotelId = req.body?.hotelId;
        const rating = req.body?.rating;

        if (!hotelId) return res.status(404).json({ message: 'enter a valid hotelId' })
        if (!rating) return res.status(404).json({ message: 'enter a valid rating' })

        //verify that user is valid
        const headers=req.headers["authorization"]
        if(!headers) return res.status(404).json({ message: 'tokens not found' })
        const token=headers.split(' ')[1]
        jwt.verify(token,process.env.ACCESSKEY,(err,val)=>{
            if(err) return res.status(403).json({ message: 'tokens corrupted' })
            flag=1
        })

        if(flag==1){
            //if rating does not existes for new hotel
            const temp = await Property.findOne({ _id: hotelId })
            const review = temp.review
            if (review == 0) {
                await Property.updateOne({ _id: hotelId }, { $set: { review: rating } })
                return res.send('rated successfully')
            }
    
            //if rating already exists
            const newrating = (review + rating) / 2
            await Property.updateOne({ _id: hotelId }, { $set: { review: newrating } })
            res.send(`rated successfully to ${newrating}`)
        }
    } catch (error) {
        console.log('something went wrong in adding the review')
        console.log(error)
        res.status(400).send('something went wrong')
    }

})

module.exports = router
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const property = require('../models/propertySchema')

router.post('/addingcomments', async (req, res) => {
    try {
        let flag=0
        let useremail;
        const headers = req.headers['authorization']
        if (!headers) return res.status(403).json({ message: 'you dont have a token' })
        const token=headers.split(' ')[1]
        jwt.verify(token,process.env.ACCESSKEY,(err,val)=>{
            if(err) return res.status(403).json({message: 'corrupted token'})
            flag=1
            useremail=val.email;
        })
        if(flag == 1){
            const hotelId=req.body?.hotelId;
            const comment=req.body?.comment;
            if((!hotelId) || (!comment)) return res.status(404).json({message: 'please enter valid data'})
            const hotel= await property.findById(hotelId)
            const commentArray=hotel.comment;
            commentArray.push(comment)
            commentArray.push(useremail)
            await property.updateOne({_id:hotelId},{$set: {comment: commentArray}})
            res.status(200).json({message: 'successfully commented'})
        }
    } catch (error) {
        console.log('something went wrong in adding comment')
        console.log(error)
        res.status(500).send('something went wrong')
    }
})

module.exports = router
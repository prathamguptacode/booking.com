require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
router.use(express.json())

router.get('/restrictedarea',(req,res)=>{
    //chekking access token in headers
    const Header=req.headers["authorization"]
    if(!Header) return res.status(400).send('token not found') //if token not found then
    const token=Header.split(' ')[1]
    jwt.verify(token,process.env.ACCESSKEY,(err,val)=>{
        if(err) return res.status(403).send('you cannot access this area')//if token is not valid

        res.json({message:'welcome to the restricted area', info: val})//if token is valid
    })
})

module.exports = router
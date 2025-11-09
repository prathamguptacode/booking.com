require('dotenv').config()
const express = require('express')
const router = express.Router()
router.use(express.json())
const cookie=require('cookie-parser')
router.use(cookie())
const jwt = require('jsonwebtoken')

router.post('/refresh',(req,res)=>{
    // try {
    //     jwt.verify(req.cookies.refreshToken,process.env.REFRESHKEY)
    //     const accessToken=jwt.sign({email: req.body.email},process.env.ACCESSKEY,{expiresIn: '5m'})
    //     res.send(accessToken)
    // } catch (error) {
    //     res.send(error)
    // }
    console.log(req.cookies.refreshToken)

    jwt.verify(req.cookies.refreshToken,process.env.REFRESHKEY,(err,val)=>{
        if(err) return res.send(err)
        const accessToken=jwt.sign({email: req.body.email},process.env.ACCESSKEY,{expiresIn: '5m'})
        res.send(accessToken)   
    })

    
})

module.exports =router
require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
router.use(express.json())

router.get('/restrictedarea',(req,res)=>{
    const Header=req.headers["authorization"]
    const token=Header.split(' ')[1]
    jwt.verify(token,process.env.ACCESSKEY,(err,val)=>{
        if(err) return res.status(403).send('you cannot access this area')
        res.json({message:'welcome to the restricted area', info: val})
    })
})

module.exports = router
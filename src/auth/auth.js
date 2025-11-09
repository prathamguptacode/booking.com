require('dotenv').config()
const express = require('express')
const router = express.Router()
router.use(express.json())
const User=require('../models/userSchema')
const otpgenerator=require('otp-generator')
const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt')
const jwt =require('jsonwebtoken')

//refresh = ducl12 res.cookie()
//access = acc12 15m

let userObj;
let otp;
router.post('/signup',async (req,res)=>{
    try {
        if(await User.findOne({email: req.body.email})) return res.send('user already exists')
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!emailRegex.test(req.body.email)){
            return res.status(400).send('enter a valid email')
        }
        if(!passwordRegex.test(req.body.password)){
            return res.status(400).send('enter a strong password')
        }
        const pass=req.body.password
        const hashedPass=await bcrypt.hash(pass,10)

        userObj={email:req.body.email, password:hashedPass};
        sendOtp(req.body.email);
        res.send('go to "/verify" to verify your email')
    } catch (error) {
        console.log('something went wrong in signup')
        console.error(error)
    }
})

function sendOtp(email){
    otp=otpgenerator.generate(8,{upperCaseAlphabets:false, specialChars:false})
    const transport=nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'prathamgupta.wk@gmail.com',
            pass: process.env.EMAILKEY
        }
    })
    const mailOption={
        from: 'prathamgupta.wk@gmail.com',
        to: email,
        subject: `Your verification code is ${otp}`,
        text: `Your verification code for booking.com is ${otp} \n never share yout otp with anyone`
    }
    transport.sendMail(mailOption,(err,val)=>{
        if(err){
            console.error('something went wrong')
        }
        else{
            console.log(`email send to ${email}`+val)
        }
    })
}

router.post('/verify',async (req,res)=>{
    const otpUser=req.body.otp
    if(otpUser==otp){
        const user = new User(userObj)
        await user.save()
        const accessToken=jwt.sign({email: userObj.email},process.env.ACCESSKEY,{expiresIn: '5m'})
        const refreshToken=jwt.sign({email: userObj.email},process.env.REFRESHKEY)
        res.cookie('refreshToken',refreshToken,{maxAge:'2800000000', httpOnly:true})
        res.json({message:"your account have been created successfully", token:accessToken})
    }
    else{
        res.send('invalid otp')
    }
})

router.get('/login',async (req,res)=>{
    if(!await User.findOne({email: req.body.email})) return res.send('cannot find your account go to signup')
    res.send(`user authenticated ${req.body.email}`)
})

module.exports = router
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!emailRegex.test(req.body.email)){
            return res.status(403).send('enter a valid email')
        }
        if(!passwordRegex.test(req.body.password)){
            return res.status(403).send('enter a strong password (your password should have atleast 8 characters, atleast 1 capital alphabet, atleast 1 alphabet, atleast 1 number and atleast 1 special character)')
        }

        if(await User.findOne({email: req.body.email})) return res.send('user already exists')
        
        const pass=req.body.password
        const hashedPass=await bcrypt.hash(pass,10)

        userObj={email:req.body.email, password:hashedPass};
        sendOtp(req.body.email);
        res.send('go to "/verify" to verify your email (if you did not recieve the otp go to /resendotp)')

    } catch (error) {
        console.log('something went wrong in signup')
        console.error(error)
        res.status(500).json({message:'something went wrong in server', error})
    }
})

function sendOtp(email){
    try {

        otp=otpgenerator.generate(6,{upperCaseAlphabets:false, specialChars:false, lowerCaseAlphabets:false})
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
        
    } catch (error) {
        console.log('something went wrong in otp-sending')
        console.error(error)
        res.status(500).json({message:'something went wrong in server', error})
    }
}

router.get('/resendotp',(req,res)=>{//for resending the otp
    try {
        sendOtp(userObj.email)
        res.send('new otp send')
    } catch (error) {
        console.log('something went wrong in resending-otp')
        console.error(error)
        res.status(500).json({message:'something went wrong in server', error})
    }
})

router.post('/verify',async (req,res)=>{
    try {
        const otpUser=req.body.otp
        if(otpUser==otp){
            const user = new User(userObj)
            await user.save()
            const accessToken=jwt.sign({email: userObj.email},process.env.ACCESSKEY,{expiresIn: '15m'})
            const refreshToken=jwt.sign({email: userObj.email},process.env.REFRESHKEY)
            res.cookie('refreshToken',refreshToken,{maxAge:'2800000000', httpOnly:true})
            res.json({message:"your account have been created successfully", token:accessToken})
        }
        else{
            res.send('invalid otp')
        }

    } catch (error) {
        console.log('something went wrong in verifing email')
        console.error(error)
        res.status(500).json({message:'something went wrong in server', error})
    }
})

router.get('/login',async (req,res)=>{
    try {
        if(!req.body.email) return res.status(404).send('enter a valid email')
        if(!await User.findOne({email: req.body.email})) return res.send('cannot find your account go to signup')
        // res.send(`user authenticated ${req.body.email}`)
        const accessToken=jwt.sign({email: req.body.email},process.env.ACCESSKEY,{expiresIn: '15m'})
        const refreshToken=jwt.sign({email: req.body.email},process.env.REFRESHKEY)
        res.cookie('refreshToken',refreshToken,{maxAge:'2800000000', httpOnly:true})
        res.json({message:"you have been logged in successfully", token:accessToken})

    } catch (error) {
        console.log('something went wrong in login')
        console.error(error)
        res.status(500).json({message:'something went wrong in server', error})
    }
})

module.exports = router
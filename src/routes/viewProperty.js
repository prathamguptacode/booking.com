const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User=require('../models/userSchema')
const Property=require('../models/propertySchema')

let userEmail;

router.get('/viewproperty',async (req,res)=>{
    try {
            const headers=req.headers['authorization']
            if(!headers) return res.status(404).json({message: 'please signin for viewing'})
            
            const accessToken=headers.split(' ')[1]
            jwt.verify(accessToken,process.env.ACCESSKEY,(err,val)=>{
                if(err) return res.status(404).json({message: 'corrupted token'})
                userEmail=val.email
            })

            if(userEmail){
                const user=await User.findOne({email: userEmail})
                const userId=user._id;
                let Userproperty=await Property.where("owner").equals(userId).populate("owner")
                Userproperty.map((e)=>{
                    e.owner.password='xxxxxxxxxxxx'
                })
                res.json({property:Userproperty})
            }
    } catch (error) {
        console.log('something went wrong in viewing property')
        console.error(error)
        res.status(500).json({message:'something went wrong in server', error})
    }

})

module.exports = router

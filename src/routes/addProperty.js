const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const property = require('../models/propertySchema')
const User = require('../models/userSchema')

router.post('/addProperty',async (req,res)=>{
    try {

        //getting owner info from jwt tokens
        let owner;
        const headers=req.headers["authorization"]
        if(!headers) return res.status(403).json({message:"please signin for adding a properting"})
        const accessToken=headers.split(' ')[1]
        jwt.verify(accessToken,process.env.ACCESSKEY,(err,val)=>{
            if(err){
                return res.status(403).json({message: 'access token expired please refresh the token'})
            }
            owner=val.email
        })

        //adding the property
        if(owner){
            const name=req.body.name;
            const address=req.body.address;
            const price=req.body.price;
            const city=req.body.city;
            if((!name) || (!address) || (!price) || (!city)){
                res.status(404).json({message:'please send all required data (name , address, price,city)'})
            }

            const dbOwner=await User.findOne({email: owner})

            const ownerProperty=new property({
                name:name,
                description:req.body.description,
                propertyType:req.body.propertyType,
                address:address,
                city:city,
                popularFacilities:req.body.popularFacilities,
                price:price,
                popularActivities:req.body.popularActivities,
                owner: dbOwner._id
            })
            // console.log(ownerProperty)
            await ownerProperty.save()
            res.json({message: 'your property has been successfully being listed',propertyDetails:ownerProperty})
        }


    } catch (error) {
        console.log('something went wrong in adding property')
        console.error(error)
        res.status(500).json({message:'something went wrong in server', error})
    }
})

module.exports = router
const express=require('express');
const router=express.Router()

router.get('/',(req,res)=>{
    res.send('hello world welcome to booking.com')
})

module.exports = router


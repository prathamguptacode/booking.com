const express = require('express')
const router = express.Router()
const cookie = require('cookie-parser')
router.use(cookie())
const property = require('../models/propertySchema')

router.post('/addingcookies', (req, res) => {
    //getting object id of hotels which than been click
    //makeing a cookie array that store id of hotel
    //max array length can be 10

    try {
        const hotelId = req.body?.hotelId;
        if(!hotelId) return res.status(404).json({message: 'please enter a valid hotel id'})
        const cookie = req.cookies?.visitedHotels;
        let hotelarray = [hotelId]

        //if cookie does not existes then
        if (!cookie) {
            res.cookie('visitedHotels', hotelarray, { maxAge: 1000000000000000 })
            return res.send('added first cookie')
        }


        //if cookie existes
        if (cookie) {
            hotelarray = [...cookie]
        }

        //updating the array
        hotelarray.push(hotelId)

        //if hotel array greater than 10
        if(hotelarray.length > 10){
            hotelarray.shift()
        }

        //sending the cookie
        res.cookie('visitedHotels', hotelarray, { maxAge: 90000000000 })

        //sending final message

        res.json({ message: "cookies updated successfully" })

    } catch (error) {
        console.log('something went wrong in adding cookies')
        console.log(error)
        res.status(500).send('server error')
    }


})

router.get('/viewcookies',async (req, res) => {
    const cookie = req.cookies?.visitedHotels;
    if(!cookie) return res.status(404).json({message: 'did not found the cookie'})

    // const hotel0=await property.findById(cookie[0])
    //using mongoose agregate method

    let hotel=[]

    for await (const element of cookie) {
        const data= await property.findById(element)
        hotel.push(data)
    }

    res.json({message: 'your cookies saved in browser', cookie,hotel})
})


module.exports = router;
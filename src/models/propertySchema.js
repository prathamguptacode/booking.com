const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{//name is required
        type:String,
        required:true
    },
    description:String,
    propertyType:String,
    address:{//adress is requires
        type:String,
        required:true
    },
    popularFacilities:String,
    price:{//price is required
        type:Number,
        required:true
    },
    review:Number,
    comment:[String],
    popularActivities:String,
    owner:{//owner details required
        type:mongoose.SchemaTypes.ObjectId,
        ref:'users',
        required:true
    },
    city:{
        type:String,
        required:true
    }
})
const propertySchema = mongoose.model('property',schema)
module.exports = propertySchema
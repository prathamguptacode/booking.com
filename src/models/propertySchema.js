const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{//name is required
        type:String,
        required:true,
        lowercase: true
    },
    description:String,
    propertyType:{
        type:String,
        lowercase: true,
        default: ''
    },
    address:{//adress is requires
        type:String,
        required:true
    },
    popularFacilities:[String],
    price:{//price is required
        type:Number,
        required:true
    },
    review:{
        type:Number,
        default:0
    },
    comment:{
        type: [String],
        default:[]
    },
    popularActivities:[String],
    owner:{//owner details required
        type:mongoose.SchemaTypes.ObjectId,
        ref:'users',
        required:true
    },
    city:{
        type:String,
        required:true,
        lowercase: true
    }
})
const propertySchema = mongoose.model('property',schema)
module.exports = propertySchema
const mongoose = require('mongoose')


const MenuItemSchema = new mongoose.Schema({

    name: {
    type: String,

    },
    price: {
        type: Number 
    },

    // description: {
    //     type: String
    // }
    categories: {
        type: [String],
        default: []
    },
    //this is used for s3/ the image bucket
    imageKey: {
        type: String
    },
    
    active: {
        type: Boolean,
        default: true
    }
    


},{
    timestamps: true
})


module.exports = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema)
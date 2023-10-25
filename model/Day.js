const mongoose = require('mongoose')


const DaySchema = new mongoose.Schema({

    name: {
        type: String,
        //monday tuesday ...
    },
   
    dayOfWeek: {
        type: Number,
        // @see getDay() documentation, 0 for Sun, 1 for Mon ...
    },

    openTime: {
        type: String
    },

    closeTime: {
        type: String
    }


},{
    timestamps: true
})


module.exports = mongoose.models.Day || mongoose.model('Day', DaySchema)
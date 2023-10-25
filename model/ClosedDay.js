const mongoose = require('mongoose')


const CloseDaySchema = new mongoose.Schema({

   date: {
    type: Date,
    unique: true
   }


},{
    timestamps: true
})


module.exports = mongoose.models.CloseDay || mongoose.model('CloseDay', CloseDaySchema)
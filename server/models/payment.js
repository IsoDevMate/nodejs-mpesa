const mongoose = require('mongoose');

const paymentSchema=mongoose.Schema({
    number: {type:String, required:true},
    trnx_id: {type:String, required:true},
    amount: {type:String, required:true},
},
{timestamp:false}
)

const Payment = mongoose.model("Payment",paymentSchema)

module.exports = Payment
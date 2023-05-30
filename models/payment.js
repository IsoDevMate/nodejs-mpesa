const mongoose = require('moongose');
const { Schema } =mongoose

const paymentSchema = new Schema({
    number: {type:string, required:true},
    trnx_id: {type:string, required:true},
    amount: {type:string, required:true},
},
{timestamp:true}
)

const Payment = moongoose.model("Payment",paymentSchema)

module.exports = Payment
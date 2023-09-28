const mongoose=require('mongoose')
const dbName = 'Rdx-db';
const connectDB=async()=>{
    try {
      await mongoose.connect(process.env.DATABASE_URI,{
             dbName: dbName,
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
    } catch (err) {
        
    }
}
module.exports=connectDB;
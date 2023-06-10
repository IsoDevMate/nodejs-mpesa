//just trying to learn jwt


const jwt = require('jsonwebtoken');

const user = { id: 123, username: 'barack ouma' };
const secretKey = process.env.MPESA_CONSUMER_SECRET

const tokens = jwt.sign(user, secretKey);

console.log(tokens);
//authenticateToken middlewware function 
const authenticateToken = (req,res,next) =>{
    const tokens = req.headers.authorization;

    if(tokens){
        jwt.verify(tokens,secretKey,(err,user) =>{
          if(err)  {
            return res.sendStatus(403)
          }
          req.user = user
          next()
        })
    }else{
        res.sendStatus(401)
    }
}

app.get('/protected route',authenticateToken,(req,res) =>{
    //access the authenticated user
    res.json({ message: 'protected route accessed succesfully'})
})

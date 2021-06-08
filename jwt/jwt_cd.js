
 
const jwt=require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY=process.env.SECRET_KEY;


 const signToken=(user)=>{
    return jwt.sign({username:user,iat: Math.floor(Date.now() / 1000) - 30 },SECRET_KEY)
    }
  
 const verifyToken=(token)=> jwt.verify(token,SECRET_KEY)   

 module.exports={
     sign:signToken,
     verify:verifyToken

 }

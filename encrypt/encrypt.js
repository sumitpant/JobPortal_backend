const bcrypt=require('bcrypt');
require('dotenv').config();
const encrypt=async (password)=>{

   let hashed= await bcrypt.hash(password,10);
   return hashed;

}

const decrypt=async (password,encrypted)=>{

    let val=await bcrypt.compare(password,encrypted);
    return val;
}

module.exports={
    encrypt: encrypt,
    decrypt: decrypt
}
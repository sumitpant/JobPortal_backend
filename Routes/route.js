const express=require('express');
const route=express.Router();
const ops=require('../Db/dbOps')
const en=require('../encrypt/encrypt')
const jw=require('../jwt/jwt_cd')
const handler=require('../handlers/handler');
//const { jobs } = require('../Db/database');
const {  commondB } = require('../Db/database');

const data=[{sumit:[{
    name:'FrontEnd ',
    location :'Delhi',
    salary:'5-8 LPA',
    recruiter:'Rakesh'
},

]
},
]
//signup Apply
route.post('/signup',(req,res,next)=>{
   ops.add(req,res,req.path);



})
//signup recruiter

route.post('/recruiter',(req,res,next)=>{
    ops.add(req,res,req.path);
})
//get  aLL jobs
route.get('/jobs',async(req,res,next)=>{
    const authHeader = req.headers['authorization']
    
    const token = authHeader && authHeader.split(' ')[1];
    if(token){
        let str=jw.verify(token);
        let result=await ops.getjobs();
         //console.log("jobs",result)
        if(result.length>0) return res.status(200).json(result);
        if(result.length==0) return res.status(200).send([]);

        else return res.status(500).send('Some Internal Error');

    }
    else{
        res.status(404).send("Not Authenticated");
    }
    
    
   
    res.json([]);
})

//login apply
route.post('/',handler.loginhandler)

//Create applying user
route.post('/signup',(req,res,next)=>{
    console.log("adesfgh");
    ops.addUser(req,res,req.path);

})
//Creating recruiting user

route.post('/recruiter',(req,res,next)=>{
    ops.addUser(req,res,req.path);
})


//login recruiter
route.post('/recruit',handler.loginhandler)


//get Applied Jobs
route.get('/applied',async(req,res,next)=>{
    const authHeader = req.headers['authorization']
    
    const token = authHeader && authHeader.split(' ')[1];
    let str=jw.verify(token);
   
    if(token){

       let result= await ops.getApplied(str.username);
       return res.json(result)

    }
     return res.status(500).json('Not authenticated')
  
 

})

//apply for jobs
route.post('/apply',(req,res,next)=>{
    console.log("apply route",req.body)
    const authHeader = req.headers['authorization']
    
    const token = authHeader && authHeader.split(' ')[1];
   if(token){
    let str=jw.verify(token)
   // console.log("res---------------------------",req.body)
    
    ops.common(req,res,req.body);

   }
   
    
   else{
    return res.status(404).send('Not Authenticated')
   }
  
 
   

})

//create Jobs
// route.post('/create',ops.create)
route.post('/create',(req,res,next)=>{
    const authHeader = req.headers['authorization']  
        const token = authHeader && authHeader.split(' ')[1];
        if(token){
            let str=jw.verify(token);
            ops.create(req,res,str.username)

        }
        else{
            return res.send('Not Autenticated');
        }
})
//get Created jobs
route.get('/createdjobs',(req,res,next)=>{
    const authHeader = req.headers['authorization']  
    const token = authHeader && authHeader.split(' ')[1];
    if(token){

        let str=jw.verify(token);
        console.log(str);
         ops.getCreatedJobs(req,res,str.username);


    }

})

//get common applied jobs 

route.get('/common',async(req,res,next)=>{
    const authHeader = req.headers['authorization']  
    const token = authHeader && authHeader.split(' ')[1];
    if(token){

        let str=jw.verify(token);
     
         let result=await ops.commonGet(str.username);
         console.log("common",result)
         if(result.length>0){
             return res.status(200).send(result);
         }
         else{
             return res.status(200).send([])
         }


    }
    else{
        return res.status(404).send('Not authenticated')
    }

})

//update common applied jobs

route.post('/update',async(req,res,next)=>{
    const authHeader = req.headers['authorization']  
    const token = authHeader && authHeader.split(' ')[1];
    if(token){

        let str=jw.verify(token);
       console.log(req.body)
       const{jobid,name,apply}=req.body;
        let result = await commondB.find({jobid,name,apply}).exec();
          if(result){
          //  MyModel.update({ age: { $gt: 18 } }, { oldEnough: true }, fn);
             let change=await commondB.update({jobid,name,apply},{status:req.body.changeto})
             console.log(change)
             return res.json(200).send('OK');
          }
          else{
              return res.send(200).send('No Job found');
          }


    }
    else{
        return res.status(404).send('Not authenticated')
    }

})
route.post('/delete',(req,res,next)=>{
    
})


module.exports=route;
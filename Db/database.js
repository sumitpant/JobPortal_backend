require('dotenv').config();
const DB=process.env.DB
const mongoose=require('mongoose');
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, 
});

const db=mongoose.connection;
//User Schema
const userSchema=new mongoose.Schema({
    email:'string',
    username:'string',
    password:'string'
    
  })
  
//Recruiter Schema
  const recruiterSchema=new mongoose.Schema({
    email:'string',
    username:'string',
    password:'string'
    
  })

  //Jobs Schema

  const jobSchema = new mongoose.Schema({
    name:'string',
    jobs:[{
    jobid: 'string',
    jobtype:'string',
    location:'string',
    salary:'string',

    }]
    

  })

  const combinedSchema =new mongoose.Schema({
    name: 'string',
    jobid: 'string',
    jobtype:'string',
    location:'string',
    salary:'string',
    status:'string',
    

  })

  const commonJob=new mongoose.Schema({
    name: 'string',
    jobid: 'string',
    jobtype:'string',
    location:'string',
    salary:'string',
    apply:'string',
    status:'string',

  })

  const user=mongoose.model('users',userSchema);
  const recruiter=mongoose.model('recruiter',recruiterSchema);

  const jobs=mongoose.model('jobs', jobSchema);
  const combined=mongoose.model('combined',combinedSchema);
  const commondB=mongoose.model('commmon',commonJob);
  


db.on('error',()=>{console.log("error")});

db.once('open',()=>{console.log('connected')});


module.exports={
    db:db,
    users:user,
    recruiter:recruiter,
    jobs:jobs,
    combined:combined,
    commondB:commondB,
};

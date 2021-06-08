const en = require('../encrypt/encrypt');
const { db, users, recruiter, jobs, combined, commomDb, commondB } = require('../Db/database');


const addUser = async (req, res, path) => {

    let result = await loginUser(req, path);

    let pass_encrypt = await en.encrypt(req.body.password);

    let body = req.body;
    body.password = pass_encrypt;


    try {
        if (result === null) {
            //check if model is users
            if (path === '/' || path === '/signup') {
                let user = new users(body);
                user.save((err, data) => {
                    if (err) console.log(err);
                    res.send("user created");
                })

            }
            else if (path === '/recruiter' || path === '/recruit') {
                console.log("----")
                let recruit = new recruiter(body);

                recruit.save((err, data) => {
                    if (err) console.log(err);
                    res.send("recruiter created");
                })

            }

        }
        else {
            res.send("already exist")
        }

    }
    catch (err) {
        console.log(err);
    }
};


const loginUser = async (req, path) => {
    let { username, password } = req.body;
    console.log("dsfgdhasfasfg", path)
    if (path === '/' || path === '/signup') {
        console.log("dsfgdh")
        let result = await users.findOne({ email: req.body.email }).exec();
        console.log("result", result)
        return result;

    }
    else if (path === '/recruiter' || path === '/recruit') {
         console.log("email",req.body.email)
        let recruit = await recruiter.findOne({ email: req.body.email }).exec();
        return recruit;

    }


}

const createJobs = async (req, res,username) => {


    //try {
        const { jobid, jobtype, location, salary } = req.body.jobs[0]
      //  console.log(username)
        let result = await jobs.findOne({ name: username }).exec();
        let body=req.body;
        body.name=username;
        console.log("result",result)
        if (result === null) {
           // console.log("sdgdfgdfhdfh");
            let job = new jobs(body);
            job.save((err, data) => {
                if (err) console.log(err);
               //res.send("job created");
            })
            let commonJob = await new combined({ name: username, jobid, jobtype, location, salary });
            commonJob.save((err, data) => {
                if (err) console.log("error Occured")
                else console.log("successful");
            })
            res.send("job created");
            
        }

       // else{
            var getResult = result.jobs.filter(data => req.body.jobs[0].jobid === data.jobid);
          
        
        console.log(
            getResult
        )

       // console.log(getResult.length,'hehe',req.body.jobs[0])
        if (getResult.length === 0) {
            let commonJob = await new combined({ name: username, jobid, jobtype, location, salary });
            commonJob.save((err, data) => {
                if (err) console.log("error Occured")
                else console.log("successful");
            })

            jobs.update({ 'name': username }, {
                '$push': {
                    'jobs': req.body.jobs[0]

                }
            }, (err) => {
                if (err) {
                    //console.log("dsafghjsdgfhgklj")
                    console.log("errpor", err);

                }

                else {
                    console.log("success")
                    
                    return res.send("success")

                }


            });

        }
        else{
            return res.status(200).send('Already exist')
        }
        
            
        


   // }
    

}

const getCreatedJobs = async (req, res, username) => {
    try {
        console.log(username)
        let result = await jobs.findOne({ name: username }).exec();
    
        if (result )
           if(result.jobs.length > 0)
            return res.status(200).json(result);

        else {
            return res.status(200).send([]);

        }

    }
    catch (err) {
        res.status(500).send("Internal Server Error")

    }


}


const getjobs = async () => {
    let result = await combined.find({}).exec();

    return result;

}
//push to common db

const common = async (req,res, body) => {
    
    let result = await commondB.find({jobid: req.body.jobid}).exec();
    
    if (result.length == 0) {
        let job = new commondB(body);
        job.save((err, data) => {
            if (err) console.log(err);
            else {
                console.log("success")
            }
            
        })

      return  res.send("applied");

    }
    console.log("helloooooo")
    return res.send('already applied');


}
//get applied jobs;

const getApplied = async (user) => {
    let result = await commondB.find({ apply: user }).exec();
    console.log("--", result)

    return result;
}
//get from commondB

const commonGet=async(username)=>{
    let result = await commondB.find({name: username}).exec();
    console.log(result)
    return result;

}


module.exports = {
    add: addUser,
    login: loginUser,
    create: createJobs,
    getCreatedJobs: getCreatedJobs,
    getjobs: getjobs,
    common: common,
    getApplied: getApplied,
    commonGet:commonGet
}


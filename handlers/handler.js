const ops = require('../Db/dbOps');
const en = require('../encrypt/encrypt');
const jw = require('../jwt/jwt_cd')


const loginHandler = async(req, res, next) => {
    console.log("login handler ",req.body)
    const {email, username, password } = req.body;
    
    let result = await ops.login(req, req.path);
   console.log(result)
    if (result === null) {
        return res.status(404).send("user not found");
    }
    else {
        console.log(result.password)
        let check = await en.decrypt(password, result.password);
        console.log(check)
        if (check) {
            let token = jw.sign(username);
            console.log("token", token)
            res.status(200).json(token);

        }
        else res.status(404).send("Wrong Password")
    }

}

module.exports = {
    loginhandler: loginHandler
}
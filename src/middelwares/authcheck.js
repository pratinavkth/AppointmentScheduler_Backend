const jwt = require("jsonwebtoken");
const authcheck = async(req,res,next)=>{
    try {
        
        const token = req.headers.authorization.split(' ')[1];


        const verifytoken = jwt.verify(token,process.env.JWT_SECRET);
        if(!verifytoken){
            return res.status(401).json({msg:"Token is not verified"});
        }

        // req.user ={
        //     id:verifytoken.id,
        // };
        // req.token = token;
        // req.user.role = 
        req.user = verifytoken;
        next();
        
    } catch (error) {
        return res.status(500).json({msg:"There is issue while Authchecking",error});
        
    }
}

module.exports = authcheck;
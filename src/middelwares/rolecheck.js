const rolecheck = (...allowedRoles)=> (req,res,next)=>{
    try {
        console.log("Inside the rolechcek");
        if (!req.user || !req.user.role) {
            return res.status(401).json({ msg: "No user role found in request" });
        }

        const role = req.user.role;

        if(!allowedRoles.includes(role)){
            return res.status(403).json({msg:"Unauthorized Acess or Acess Denied"});
        }
        console.log("rolecheck done");


        next();


        
    } catch (error) {
        return res.status(500).json({msg:"Rolechecking issue ",error});
        
    }
}
module.exports = rolecheck;
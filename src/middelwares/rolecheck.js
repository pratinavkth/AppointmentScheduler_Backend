const rolecheck = (...allowedRoles)=> (req,res,next)=>{
    try {
        const role = req.user.role;

        if(!allowedRoles.includes(role)){
            return res.status(403).json({msg:"Unauthorized Acess or Acess Denied"});
        }


        next();

        
    } catch (error) {
        return res.status(500).json({msg:"Rolechecking issue ",error});
        
    }
}
module.exports = rolecheck;
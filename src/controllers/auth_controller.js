const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendEmail");

exports.Register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        const emailexist =await User.findOne({where: {email}});
        if(emailexist){
            return res.status(401).json({msg:"Email Already Exisr"});
        }
        const hashedPassword = await bcrypt.hash(password,8);

        let user = await User.create({name,
            email,
            password:hashedPassword,
            role:"user",
            isVerified:false,});
        

        // generating email token
        const emailtoken = jwt.sign(
            {id:user.id},
            process.env.EMAIL_TOKEN_SECRET,
            {expiresIn:"1d"},
        );
        // sending verification mail
        const verifylink = `http://localhost:3000/index/authroute/verifyEmail?token=${emailtoken}`;
        await sendMail(
            user.email,
            "Verify your Email",
            `<p>Click  <a href="${verifylink}">here</a> to  verify your email</p>`

        );

        // await user.save();
        return res.status(200).json({
      msg: "User registered. Please verify your email.",
      });


        
    } catch (error) {
        console.error("THere is Issue while registring the user",error);
        return res.status(500).json({msg:"There is a issue while regestring the user"});
    }
}
exports.Login = async(req,res)=>{
    try {
        const {email,password}= req.body;
        const emailexist = await User.findOne({where:{email}});
        if(!emailexist){
            return res.status(401).json({msg:"User with this email is not there"});
        }
        const comparePassword = await bcrypt.compare(password,emailexist.password);
        if(!comparePassword){
            return res.status(400).json({msg:"Password is incorrect"});
        }
        const acesstoken = jwt.sign({id:emailexist.id,role:emailexist.role},process.env.JWT_SECRET,{expiresIn:"15m"});
        const refreshtoken = jwt.sign({},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});

        emailexist.refreshToken = refreshtoken;
        await emailexist.save();


        return res.status(200).json({
            msg: "Login successful",
            acesstoken,
            refreshtoken,
            user: {
              id: emailexist.id,
              name: emailexist.name,
              email: emailexist.email,
      },
    });


    } catch (error) {
        console.error("THere is Issue while Logging the user",error);
        return res.status(500).json({msg:"There is a issue while logging in the issue"});
    }
}

exports.verifyEmail = async(req,res)=>{
    try {
        const {token} = req.query;
        const decoded = jwt.verify(token,process.env.EMAIL_TOKEN_SECRET);
        const user = await User.findByPk(decoded.id);
        console.log(decoded.id);
        if(!user) return res.status(404).json({msg:"User not Found"});

        user.isVerified = true;
        await user.save();
        return res.send("Email verified successfully.");
    } catch (error) {
        return res.status(404).json({msg:"Invalid or Expired Token"});
    }
}


exports.refreshToken = async(req,res)=>{
    const {refreshToken} = req.body;

        if(!refreshToken){
            return res.status(401).json({msg:"no Refresh token"})
        }
    try {

        const decoded = jwt.verify(refreshToken,process.env.EMAIL_TOKEN_SECRET);
        const user = await User.findByPk(decoded.id);
        if(!user || user.refreshToken !== refreshToken){
            return res.status(403).json({msg:"Token is invalid or reused"});
        }

        // generate new refreshtoken

        const newRefreshToken = jwt.sign(
            {id:user.id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:"7d"},

        )

        user.refreshToken = newRefreshToken;
        await user.save();

        // generate new acesstoken

        const newAcessToken = jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:"15m"}
        );

        return res.json({acesstoken:newAcessToken , refreshToken:newRefreshToken});

        

        
    } catch (error) {
        return res.status(500).json({msg:"Error Occured While refreshing the token"});
        
    }
}

exports.logout = async(req,res)=>{
    try {
        const { refreshtoken } = req.body;
        if(!refreshtoken){
            return res.status(401).json({msg:"There is no token present"});
        }
        const decode = jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findByPk(decode.id);

        if(!user || user.refreshToken !== refreshtoken){
            return res.status(403).json({msg:"Refresh token is not valid or already logged out"});
        }

        user.refreshToken = null;
        await user.save();

        return res.status(200).json({msg:"User Logged Out"});
    } catch (error) {
        return res.status(500).json({msg:"Error Occured while logout :",error});
        
    }
}


exports.registration_by_admin = async(req,res)=>{
    try {
        const {name,email,password,role} = req.body;
        const emailexist =await User.findOne({where: {email}});
        if(emailexist){
            return res.status(401).json({msg:"Email Already Exisr"});
        }
        const hashedPassword = await bcrypt.hash(password,8);

        const allowedRoles = ["admin", "serviceProvider"];
        if (!allowedRoles.includes(role)) {
              return res.status(400).json({ msg: "Invalid role" });
            }

        let user = await User.create({name,
            email,
            password:hashedPassword,
            role,
            isVerified:false,});
        

        // generating email token
        const emailtoken = jwt.sign(
            {id:user.id},
            process.env.EMAIL_TOKEN_SECRET,
            {expiresIn:"1d"},
        );
        // sending verification mail
        const verifylink = `http://localhost:3000/index/authroute/verifyEmail?token=${emailtoken}`;
        await sendMail(
            user.email,
            "Verify your Email",
            `<p>Click  <a href="${verifylink}">here</a> to  verify your email</p>`

        );
        return res.status(200).json({
      msg: "User registered. Please verify your email.",
      });
    } catch (error) {
        return res.status(500).json({msg:"Error Occured While Registring the admin and serviceprovider "})
    }
}
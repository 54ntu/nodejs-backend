const {asyncHandler} = require("../utils/asyncHandler")
const {ApiError} = require("../utils/ApiError")
const  jwt  = require("jsonwebtoken")
const {user} = require("../models/user.models")


const verifyJwt = asyncHandler(async(req,res,next)=>{
    
    try {
        const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        
        
       if(!token){
        throw new ApiError(401,"unauthorized user request")
       }
    
       console.log("token while logging out is : ", token)
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("decoded token : ", decodedToken)
    
      const User = await user.findById(decodedToken._id).select(" -password -refreshToken")
    
      if(!User){
    
        throw new ApiError(401,"invalid access token!!!!")
      }
    
      req.user = User;
      next()
    
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
        
    }

})

module.exports ={verifyJwt}
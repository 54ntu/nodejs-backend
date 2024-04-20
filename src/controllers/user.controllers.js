const {asyncHandler} = require('../utils/asyncHandler')
const {ApiError} = require('../utils/ApiError')
const {user} = require("../models/user.models")
const {uploadOnCloudinary}= require("../utils/cloudinary")
const {ApiResponse} = require('../utils/ApiResponse')
const registeUser = asyncHandler(async (req,res)=>{
    //get the data from body, form
    //check empty or not
    //email and username already exist or not
    //files are there or not
    //upload them to cloudinary,avatar is available or not
    //create user object
    //remove password and refreshToken field from response
    //check for user response
    //return response

    const {fullName,username,email,password} = req.body
    // console.log(fullName,email)
    if(!(fullName && email && username &&password)){
        throw new ApiError(400, "all fields are required!!")
    }

    const existeduser = user.findOne({
        $or:[{email},{username}]
    })

    if(existeduser){
        throw new ApiError(409,"user already exist")
    }

  const avatarLocalPath  = req.files?.avatar[0]?.path;
    console.log(req.files)
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar image is required")
    }


    const avatar= await uploadOnCloudinary(avatarLocalPath)
    console.log('avatar from cloudinary : ', avatar)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    console.log('cover image from cloudinary: ',coverImage)


    if(!avatar){
        throw new ApiError(400,"avatar files is required")
    
    }

    const User = await user.create({
        fullName,
        avatar:avatar.url,
        username:username.toLowerCase(),
        coverImage:coverImage?.url || "",
        email,
        password


    })

   const createdUser= await user.findById(User._id).select(
    " -password -refreshToken"
   )
   

   if(!createdUser){
    throw new ApiError(500,"something went wrong while registering user!!!")
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully!!!")
   )


})


module.exports = {registeUser}
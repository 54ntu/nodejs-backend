const {asyncHandler} = require('../utils/asyncHandler')
const {ApiError} = require('../utils/ApiError')
const {user} = require("../models/user.models")
const {uploadOnCloudinary}= require("../utils/cloudinary")
const {ApiResponse} = require('../utils/ApiResponse')
const jwt = require('jsonwebtoken')


const generateAccessAndRefreshTokens = async(userId)=>{
  try {
     const e_user=await user.findById(userId)
    const accessToken=  e_user.generateAccessToken()
    const refreshToken= e_user.generateRefreshToken()
    e_user.refreshToken = refreshToken
    await e_user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}

    
  } catch (error) {
    throw new ApiError(500,"something went wrong while generating refresh token and access token!!!!")
    
  }
}


const registerUser = asyncHandler(async (req, res) => {
  //get the data from body, form
  //check empty or not
  //email and username already exist or not
  //files are there or not
  //upload them to cloudinary,avatar is available or not
  //create user object
  //remove password and refreshToken field from response
  //check for user response
  //return response

  const { fullName, username, email, password } = req.body;
  // console.log(fullName,email)
 
  if([fullName,email,password,username].some((field)=>{field?.trim()===""  })){
    throw new ApiError(400,'all fields are required!!!!!!!')
  }

  const existeduser = await user.findOne({
    $or: [{ email }, { username }],
  });

  if (existeduser) {
    throw new ApiError(409, "user already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // console.log(req.files)
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // console.log('avatar from cloudinary : ', avatar)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // console.log('cover image from cloudinary: ',coverImage)

  if (!avatar) {
    throw new ApiError(400, "avatar files is required");
  }

  // let avatarUrl, coverImageUrl;

  // //upload avatar if provided
  // if(req.files && req.files.avatar){
  //     const avatarLocalPath = req.files.avatar[0].path;
  //     const avatar = await uploadOnCloudinary(avatarLocalPath);
  //     avatarUrl = avatar?.url;
  // }else{
  //     throw new ApiError(400,"Avatar image is required")
  // }

  // //Upload cover image if provided

  // if(req.files && req.files.coverImage){
  //     const coverImageLocalPath = req.files.coverImage[0].path;
  //     const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  //     coverImageUrl = coverImage?.url;
  // }

  const new_User = await user.create({
    fullName,
    avatar: avatar.url,
    username: username.toLowerCase(),
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  const createdUser = await user
    .findById(new_User._id)
    .select(" -password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user!!!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully!!!"));
});



const loginUser = asyncHandler(async (req,res)=>{
  //get username or email and password
  //check validation like empty fields
  //find the user
  //compare data password  and other credentials
  //if password is true then we have to generate access and refresh token and send it to user
  //send cookies
  //return response


  const {username,email,password} = req.body

  if(!(username || email) ){
    throw new ApiError(400,"email or username is required")
  } 

  const existedUser = await user.findOne(
    {
      $or:[{email},{username}]
    }
  )

  if(!existedUser){
    throw new ApiError(404,"user with username or email doesnot found")
  }


  const isPasswordValid=await existedUser.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new ApiError(401,"credentials doesnot matched")

  }


  const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(existedUser._id)
  console.log("access token for user while login is : ", accessToken)

   const loggedInUser= await user.findById(existedUser._id).select(" -password -refreshToken")

   const options={
    httpOnly:true,
    secure:true
   }


   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken,options)
   .json(
    new ApiResponse(200,
    {
      loggedInUser,accessToken,refreshToken
    },

    "user logged in successfully!!!"
  ),
   )
})




const logoutUser = asyncHandler(async(req,res)=>{
  console.log("user in to logout page",req.user)

   await user.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined,
      }
    },
    {
      new:true,
    }
   )
  
   const options ={
    httpOnly:true,
    secure:true
   }

  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,{},"user logout successfully!!!!!!!")
  )
  

})


const refreshAcessToken = asyncHandler(async(req,res)=>{

  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  
    if(!incomingRefreshToken){
      throw new ApiError(401,'unauthorized request')
    }
  
  
   const decodedToken= jwt.verify(incomingRefreshToken, process.env.REFRESS_TOKEN_SECRET);
  
   const User=await user.findById(decodedToken._id)
  
  
   if(!User){
    throw new ApiError(401, "invalid refresh token!!!!")
   }
  
   if(incomingRefreshToken !== User?.refreshToken){
    throw new ApiError(401, "refresh token is expired ro used")
  
   }
  
   const options ={
    httpOnly:true,
    secure:true
   }
  
   const {accessToken,new_refreshToken}=await generateAccessAndRefreshTokens(User._id);
  
   return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", new_refreshToken, options)
     .json(new ApiResponse(200, 
      {accessToken, refreshToken:new_refreshToken},
      "new refresh token is generated!!"
    
    ));
  } catch (error) {
    throw new ApiError(401, error?.message || "unauthorized request!!!")
    
  }

})


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAcessToken,
};
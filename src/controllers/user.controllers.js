const {asyncHandler} = require('../utils/asyncHandler')
const {ApiError} = require('../utils/ApiError')
const {user} = require("../models/user.models")
const {uploadOnCloudinary}= require("../utils/cloudinary")
const {ApiResponse} = require('../utils/ApiResponse')

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


module.exports = {registerUser}
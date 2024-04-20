const cloudinary = require('cloudinary').v2
const fs = require('fs')


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload file to cloudinary
       const response =await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        })
        //file uploaded successfully on cloudinary
        console.log('file is uploaded successfully ',response.url)
        return response


        
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary
        return null;
    }
}


module.exports ={uploadOnCloudinary}
const {asyncHandler} = require('../utils/asyncHandler')


const registeUser = asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:'ok'
    })
})


module.exports = {registeUser}
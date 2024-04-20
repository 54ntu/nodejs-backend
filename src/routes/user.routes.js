const {Router} = require('express');
const { registeUser } = require('../controllers/user.controllers');
const {upload} = require('../middlewares/multer.middleware')



const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registeUser)




module.exports ={router}
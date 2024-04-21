const {Router} = require('express');
const { registerUser, loginUser, logoutUser, refreshAcessToken, changeCurrentPassword, getCurrentUser, updateAcountDetail, updateUserAvatar, updateCoverImage } = require("../controllers/user.controllers");
const {upload} = require('../middlewares/multer.middleware');
const { verifyJwt } = require('../middlewares/auth.middleware');



const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);


router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refresh-token").post(refreshAcessToken)




//updation routes
router.route("/update-pass").post(verifyJwt,changeCurrentPassword)
router.route("/get-currentUser").get(verifyJwt,getCurrentUser)
router.route("/update-account").patch(verifyJwt,updateAcountDetail)


router.route("/update-avatar").patch(verifyJwt, upload.single("avatar"),updateUserAvatar)
router.route("/update-cover").patch(verifyJwt,upload.single("coverImage"),updateCoverImage)


module.exports ={router}
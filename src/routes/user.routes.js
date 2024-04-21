const {Router} = require('express');
const { registerUser, loginUser, logoutUser, refreshAcessToken } = require("../controllers/user.controllers");
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

module.exports ={router}
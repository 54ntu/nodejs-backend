const {Router} = require('express');
const { registeUser } = require('../controllers/user.controllers');

const router = Router();
router.route("/register").post(registeUser)




module.exports ={router}
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express();

app.use(cors()) //configuring cors 

app.use(express.json({limit:'16kb'}))

app.use(express.urlencoded({extended:true,limit:"16kb"})) // this urlencoded helps to fetch data from URL

app.use(express.static("public")) // static method helps to handle images, files
app.use(cookieParser()) // to handle cookies


// routes import
const {router} = require('./routes/user.routes')

//routes declaration
app.use("/api/v1/user",router)




module.exports = {app}
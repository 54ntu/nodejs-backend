require('dotenv').config()
const {app} = require('./app')
const { connectDB } = require("./db/db");



connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is listening at port ${process.env.PORT}`)

    })
})
.catch((error)=>{
    console.log('database connection failed!!!!!',error)
})



const mongoose = require('mongoose')
const {DB_NAME, DB_Name} = require('../constants')

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`);
        console.log(`database connected successfully || DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('ERROR connecting database',error);
        process.exit(1)
    }

}

module.exports = {connectDB}

// const mongoose = require("mongoose")
// const dotenv = require("dotenv")

// dotenv.config({path: "./config/config.env"})
// 
// mongoose.Promise = global.Promise;

// mongoose.connect(db, { useNewUrlParser : true, 
// useUnifiedTopology: true }, function(error) {
//     if (error) {
//         console.log("Error!" + error);
//     }
//     else{
//         console.log("All fine")
//     }
// });

// const mongoose = require('mongoose')
// const dotenv = require("dotenv")
// dotenv.config({path: "./config/config.env"})
// var query = process.env.MONGO_URI
// const db = query
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(db, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useFindAndModify: false,
//     })

//     console.log(`MongoDB Connected:`)
//   } catch (err) {
//     console.error(err)
//     process.exit(1)
//   }
// }


const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      ping:1

    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB
const express = require("express")
const path = require("path")
const app = express()
const api = require("./routers/routes.js")
const dotenv = require("dotenv")
const methodOverride = require('method-override')
const morgan = require("morgan")
const passport = require("passport")
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
const mongoose = require("mongoose")
const connectDB = require('./Db.js')
const expressLayouts = require("express-ejs-layouts")
const cors = require("cors")
// const multer = require("multer")
// const crypto = require("crypto")
// const GridFsStorage = require("multer-gridfs-storage")
// const Grid = require("gridfs-stream")

//Storing global variables
dotenv.config({path: "./config/config.env"})

connectDB()

//using ejs layouts
app.use(expressLayouts)

//Passport config
require("./passport/passport")(passport)


//To display all https requests on console
app.use(morgan("tiny"))

//Setting template engine
app.set("view engine", "ejs", {layout: "layouts/main"})
app.set("layout", "layouts/main")
// Static folder
app.use(express.static(path.join(__dirname, "public" )))

//Sessions
// app.use(session ({
//     secret : "sans cool",
//     resave : false,
//     saveUninitialized: false,
//     store: new MongoDBStore({mongooseConnection: mongoose.connection})
// }))

// // Passport middleware
// app.use(passport.initialize())
// app.use(passport.session())
app.use(express.json())
app.use(cors({origin: "http://localhost:5000/", credentials: true}))
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true
    })
)
app.use(passport.initialize())
app.use(passport.session())


//Parses the text as url encoded data
app.use(express.urlencoded({extended: false}))
//app.use(express.urlencoded({extended: true}))

//parses text as json
app.use(express.json())

//To use delete method in html forms
app.use(methodOverride('_method'))

//To use update method in html forms
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

//connecting to middleware
app.use("/", api)
app.use("/auth", require("./routers/auth.js"))
app.use(function (req, res, next) {
    res.status(404).render("error/404")
  })

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).render("error/500")
})
app.listen(process.env.PORT || 5000, () => console.log(`Server Started on Port `))

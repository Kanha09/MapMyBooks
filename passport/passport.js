const GoogleStrategy = require("passport-google-oauth20").Strategy
const mongoose = require("mongoose")

const User = require("../models/User")

// module.exports = function(passport) {
//     passport.use(new GoogleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "/auth/google/callback"

//     },
//     async (accessToken, refreshToken, profile, done) => {
//         const newUser = {
//             googleId: profile.id,
//             displayName: profile.displayName,
//             firstName: profile.name.givenName,
//             lastName: profile.name.familyName,
//             image: profile.photos[0].value
//         }

//         try {
//             //checks to see if user exists
//             let user = await User.findOne({ googleId: profile.id})

//             if (user) {
//                 done(null, user)
//             } else {
//                 //creates new user if user does not already exists
//                 user = await User.create(newUser)
//                 done(null, user)
//             }
//         } catch (err) {
//             console.log(err)

//         }
//     }
//     ))

//     passport.serializeUser((user, done) => {
//         done(null, user.id)
//     })

//     passport.deserializeUser((id, done) => {
//         User.findById(id, ( err , user) => {
//             done(err, user)
//         })
//     })
// }

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
          User.findOne({googleId: profile.id}, async (err, doc) => {
            if (err){
                return cb(err, null)
            }  
        
            if (!doc){
                 const newUser = new User({
                   googleId: profile.id,
                   firstName: profile.name.givenName,
                   lastName: profile.name.familyName,
                   createdAt : new Date()
                
                 })
                 await newUser.save()
                 cb(null, newUser)
              }
              cb(null, doc)
          } )
     
     }
    ));
   passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, ( err , user) => {
            done(err, user)
        })
    })
}
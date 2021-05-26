const GoogleStrategy = require("passport-google-oauth20").Strategy
const mongoose = require("mongoose")

const User = require("../models/User")

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
                   email: profile.emails[0].value,
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
const express = require('express')
const router = express.Router()
const Book = require('../models/Book')
const dotenv = require("dotenv")

const { ensureAuth, ensureGuest, loggedIn} = require("../middleware/auth")

dotenv.config({path: "./config/config.env"})

//Get home page
router.get("/", (req, res) => {
    res.render("index", {layout : "layouts/indexmain"})
})



//fileUpload

//Get sell page
router.get("/sell",ensureAuth ,(req, res)=> {
    try {
        res.render("sell")
    } catch (err) {
        if (err.status === 500){
            res.render("/error/500")
        } else if( err.status === 404){
            res.render("/error/404")

        }

    }
    
})

//Get buy page
router.get("/buy", ensureAuth,(req, res)=> {
    try {
        res.render("buy")
    } catch (err) {
        if (err.status === 500){
            res.render("/error/500")
        } else if( err.status === 404){
            res.render("/error/404")

        }

    }
})

//get all books
// router.get("/books" ,async(req, res)=> { 
//     try{
//     Book.find(function(err, data) {
//         if (err) {
//             console.log(err)
//         } else {
//             res.send(data)
//         }
//     }) } 
//     catch (err){
//         res.render("/error/500")
//     }
// })

//Login
router.get("/login",  (req, res) => { 
    res.render("login",  {layout: "layouts/login"})
})

//Get account
router.get("/account", ensureAuth, async(req, res)=> {
    try {
        const books = await Book.find({user: req.user.id}).sort({ createdAt: 'desc' })
  
        res.render("account", {
            name: req.user.firstName,
            myBooks: books,
        })
    } catch (err) {
        console.log(err)
        res.render("error/500")
    }
})

//make new book
router.post("/sell",async (req, res) => {
    try{
	const newBook = new Book({
		title: req.body.title,
		subject: req.body.subject,
        grade : req.body.grade,
        description: req.body.description,
        user:  req.user.id,
        isReferenceBook: req.body.isReferenceBook,
    	})
    
	await newBook.save()
    
	res.redirect("/account")
}
    catch(err) {
        res.render("/error/500")
    }
    
})

//delete item
router.delete("/books/:id", async(req, res) => {
    try {
        await Book.deleteOne({_id: req.params.id})
        res.redirect("/account")
        // res.status(204).send()
    } catch {
        res.status(404)
        res.send({error: "post doesnt exist"})
    }
})

//get individual books
router.get("/books/:id", async(req, res) => {
    try {
        const book = await Book.findOne({_id: req.params.id})
        res.render("bookProfile", {bookProps: book, userName: req.user.firstName})
        
    } catch (err) {
        res.status(404)
        res.send({error : "Post Doesnt Exist"})
    }
})

//filter database
router.post("/availableBooks/", async(req, res) =>{
    
    const books = await Book.find({subject: req.body.subject,grade : req.body.grade, isReferenceBook: req.body.isReferenceBook}).sort({ createdAt: 'desc' })
    
    res.render("filteredBooks", {myBooks: books,  name: req.user.firstName})
   
})



module.exports = router;
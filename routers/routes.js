const express = require('express')
const router = express.Router()
const Book = require('../models/Book')
const upload = require("../utils/multer")
const path = require("path")
const cloudinary = require("../utils/cloudinary")
const fs = require("fs")

const { ensureAuth, ensureGuest, loggedIn} = require("../middleware/auth")


//Get home page
router.get("/", (req, res) => {
    console.log(__dirname)
    res.render("index", {layout : "layouts/indexmain"})
})

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
router.post("/sell",upload.array("image", 3), async (req, res) => {
    try{
        const uploader = async (path) => await cloudinary.uploads(path, "Images")
        
        if (req.method === "POST")
        {
            const urls = []
            const files = req.files
            
            for (const file of files) {
                const {path} = file
                const newPath = await uploader(path)
                urls.push(newPath)
                fs.unlinkSync(path)
            }
                // res.status(200).json({
                // message: 'images uploaded successfully',
                // data: urls
                // })
            
            img_urls = []
            for(const url of urls){
                img_urls.push(url.url)
            }
            public_ids = []
            for(const id of urls){
                public_ids.push(id.id)
            }
        
        
            
        } else{
            res.status(405).json({
                err: "Images not uploaded successfully"
            })
        }
	const newBook = new Book({
		title: req.body.title,
		subject: req.body.subject,
        grade : req.body.grade,
        description: req.body.description,
        user:  req.user.id,
        username: String(req.user.firstName),
        isReferenceBook: req.body.isReferenceBook,
        image_ids: img_urls,
        public_ids: public_ids
    	})
	await newBook.save()
    console.log(String(req.user.firstName))
    
	res.redirect("/account")
}
    catch(err) {
        console.log(err)
    }
    
})

//delete item
router.delete("/books/:id", async(req, res) => {
    try {
        await Book.deleteOne({_id: req.params.id})
    
        res.redirect("/account")
        res.status(204).send()
    } catch{
        res.status(404)
        res.send({error: "post doesnt exist"})
        
    }
})


//get individual books
router.get("/books/:id", async(req, res) => {
    try {
        const book = await Book.findOne({_id: req.params.id})
        
        res.render("bookProfile", {bookProps: book})
        console.log(book.image_ids)
        
    } catch (err) {
        res.status(404)
        res.send({error : "Post Doesnt Exist"})
    }
})

//filter database
router.post("/availableBooks/", async(req, res) =>{
    
    const books = await Book.find({subject: req.body.subject,grade : req.body.grade, isReferenceBook: req.body.isReferenceBook}).sort({ createdAt: 'desc' })
    console.log()
    res.render("filteredBooks", {myBooks: books})
   
})



module.exports = router;

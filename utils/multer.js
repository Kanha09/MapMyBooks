const multer = require("multer")
const dotenv = require("dotenv")
const path = require("path")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads")
    },
    filename:function (req, file, cb) {
        cb(null,Date.now() + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null , true)
    } else {
        cb({message: "unsupported type"}, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 10240 * 10240},
    fileFilter: fileFilter

})

module.exports = upload
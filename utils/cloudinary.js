const cloudinary = require("cloudinary")
const dotenv = require("dotenv")

dotenv.config()

cloudinary.config({
    cloud_name: "map-my-books",
    api_key: 853492255873784,
    api_secret: "mTLNXkjF7wDSAym92bo5m7esWpk"
})

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id,
                
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    }
    )
}

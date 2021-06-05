const mongoose = require("mongoose")

const schema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    subject:  {
        type: String,
        require: true
    },
    grade:  {
        type:  Number,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    
    },
    description: {
        type: String,
        require: true
    },
    isReferenceBook: {
        type: Boolean,
        require: true
    },
    image_ids: {
        type: Array,
    },
    public_ids: {
        type: Array,
    }
})

module.exports = mongoose.model("Book", schema)
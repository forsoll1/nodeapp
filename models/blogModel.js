const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    site:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    blogtext:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },

})

module.exports = mongoose.model("Blog", blogSchema)
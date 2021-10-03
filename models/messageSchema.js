const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    autor: {
        email: {
            type: String,
            required: true
        },
        role: {
            type: Number,
            default: 0,
            required: true
        }
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },

})

module.exports = mongoose.model("Message", messageSchema)
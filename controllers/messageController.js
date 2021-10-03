const Message = require('../models/messageSchema')
const logger = require('../config/winston')

const messageController = {

    addMessage: async (req, res) => {
        try {
            if (!req) {
                return res.status(404).json({
                    msg: 'Error al publicar tu mensaje'
                })
            }
            const data = await {
                ...req
            }
            await Message.create(data)
        } catch (err) {
            console.log({
                msg: err.message
            })
        }
    },

    getAllMessages: async (req, res) => {
        try {
            const allMessages = await Message.find()
            return res.status(200).json({
                allMessages
            })
        } catch (error) {
            return res.status(400).json({
                msg: err.message
            })
        }
    },

    getUserMessages: async (req, res) => {
        try {
            const userEmail = req.params.email
            const userMessages = await Message.find({
                email: {
                    $eq: userEmail
                },
            });
            if (userMessages) {
                return userMessages;
            }
        } catch (error) {
            return res.status(400).json({
                msg: err.message
            })
        }
    }
}

module.exports = messageController
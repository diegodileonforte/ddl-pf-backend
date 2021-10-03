const Order = require('../models/orderSchema')
const nodemailer = require('nodemailer')
const logger = require('../config/winston')

const orderController = {

    newOrder: async (req, res) => {
        const newOrder = new Order(req.body)

        try {
            const savedOrder = await newOrder.save()

            // Envío de mail a Admin con datos de nueva orden generada
            const mailOptions = {
                from: "Notificaciones de Ecommerce",
                to: process.env.GMAIL_ACCOUNT,
                subject: 'Nueva orden de compra generada!',
                html: `<h1>Se registró una nueva orden de compra</h1> <br/> ${savedOrder}`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err)
                }

                logger.info.info(`Correo enviado: ${info}`)
            })

        } catch (err) {
            res.status(500).json({
                msg: err.message
            })
        }
    },

    updateOrder: async (req, res) => {
        try {
            const updatedOrder = await Order.findByIdAndUpdate(
                req.params.id, {
                    $set: req.body,
                }, {
                    new: true
                }
            )
            res.status(200).json(updatedOrder)
        } catch (err) {
            res.status(500).json({
                msg: err.message
            })
        }
    },

    deleteOrder: async (req, res) => {
        try {
            await Order.findByIdAndDelete(req.params.id)
            res.status(200).json('Orden eliminada con éxito.')
        } catch (err) {
            res.status(500).json({
                msg: err.message
            })
        }
    },

    getOrderByUserId: async (req, res) => {
        try {
            const orders = await Order.find({
                user_id: req.params.id
            })
            res.status(200).json(orders)
        } catch (err) {
            res.status(500).json({
                msg: err.message
            })
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find()
            res.status(200).json(orders)
        } catch (err) {
            res.status(500).json({
                msg: err.message
            })
        }
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_AUTH_PASS
    }
})

module.exports = orderController
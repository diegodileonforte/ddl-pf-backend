const Cart = require('../models/cartSchema')

const cartController = {
    newCart: async (req, res) => {
        const newCart = new Cart(req.body)

        try {
            const savedCart = await newCart.save()
            res.status(200).json(savedCart)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },

    getCartByUserId: async (req, res) => {
        try {
            const cart = await Cart.findOne({
                user_id: req.params.id
            });
            res.status(200).json(cart)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },

    updateCart: async (req, res) => {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(
                req.params.id, {
                    $set: req.body,
                }, {
                    new: true
                }
            )
            res.status(200).json(updatedCart)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },

    deleteCart: async (req, res) => {
        try {
            await Cart.findByIdAndDelete(req.params.id)
            res.status(200).json({
                msg: "Carrito eliminado con éxito"
            })
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = cartController
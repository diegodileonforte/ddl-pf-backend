const Users = require('../models/userSchema')

const authAdmin = async (req, res, next) => {
    try {
        const user = await Users.findOne({
            _id: req.user.id
        })
        if (user.role === 0)
            return res.status(400).json({ msg: "Acceso denegado a los recursos de Administrador" })

        next()

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

module.exports = authAdmin
const Users = require('../models/userSchema')
const logger = require('../config/winston')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password, age, tel } = req.body

            const user = await Users.findOne({ email })

            if (user) return res.status(400).json({ msg: `Usuario con email: ${email} ya existe.` })

            if (password.length < 6)
                return res.status(400).json({ msg: 'El password debe tener al menos 6 caracteres de longitud.' })

            // Encriptación de password
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordHash, age, tel
            })

            // Gardado de usuario en MongoDB
            await newUser.save()

            
            // Envío de mail a Admin con datos de nuevo usuario registrado
            const mailOptions = {
                from: "Notificaciones de Ecommerce",
                to: process.env.GMAIL_ACCOUNT,
                subject: 'Nuevo usuario registrado en Ecoomerce!',
                html: `<h1>Se registró un nuevo usuario en tu Ecommerce!</h1> <br/> Nombre: ${newUser.name} <br/> Email: ${newUser.email} <br/> Edad: ${newUser.age} <br/> Teléfono: ${newUser.tel}`
            }

            transporter.sendMail(mailOptions, (err, info) =>{
                if (err){
                    console.log(err)
                }
            
                logger.info.info(`Correo enviado: ${info}`)
            })  

            // Creación de jsonwebtoken para autenticación
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken })

        } catch (err) {
            logger.error.error(`Error ${err.message}`)
            return res.status(500).json({ msg: err.message })
        }

    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "El usuario no existe." })

            const userMatch = await bcrypt.compare(password, user.password)
            if (!userMatch) return res.status(400).json({ msg: "Contraseña incorrecta" })

            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: 'Usuario deslogueado.' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Se requiere Login o Registro" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Se requiere Login o Registro" })

                const accesstoken = createAccessToken({ id: user.id })

                res.json({ accesstoken })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },

    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({ msg: "El usuario no existe." })

            res.json(user)
            
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_AUTH_PASS
    } 
})

module.exports = userController
require('dotenv').config()
const express = require('express')
const session = require("express-session")
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const logger = require('./config/winston.js')

const cluster = require('cluster')
const os = require('os')

const modoCluster = process.argv[3] == 'CLUSTER'

if (modoCluster && cluster.isMaster) {
    const numCPUs = os.cpus().length

    console.log(`Número de procesadores: ${numCPUs}`)
    console.log(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
}
else {

    const app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use(
        session({
          secret: "secret",
          rolling: true,
          resave: false,
          saveUninitialized: false,
          cookie: { maxAge: 60000 },
        })
      )
    app.use(cors())
    app.use(fileUpload({
        useTempFiles: true
    }))

    app.get('/', (req, res) => {
        res.send("Bienvenidos!")
    })

    // Routes
    app.use('/user', require('./routes/userRouter'))
    app.use('/api', require('./routes/categoryRouter'))
    app.use('/api', require('./routes/upload'))
    app.use('/api', require('./routes/productRouter'))
    app.use('/api/cart', require('./routes/cartRouter'))
    app.use('/api/order', require('./routes/orderRouter'))
    app.use('/api/chat', require('./routes/messageRouter'))

    // Conexión a MongoDB
    const URI = process.env.MONGODB_URL

    mongoose.connect(URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw err;
        logger.info.info('Conectado a MongoDB')
    })

    const PORT = process.env.PORT || parseInt(process.argv[2]) || 8080
    app.listen(PORT, () => {
        logger.info.info(`Servidor corriendo en puerto ${PORT}`)
    })
}
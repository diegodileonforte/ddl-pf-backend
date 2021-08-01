const winston = require('winston')

const format = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = {
    error: winston.createLogger({
        level: 'error',
        format: format,
        transports: [new winston.transports.File({ filename: 'log/error.log' })]
    }),
    warn: winston.createLogger({
        level: 'warn',
        format: format,
        transports: [new winston.transports.File({ filename: 'log/warn.log' })]
    }),
    info: winston.createLogger({
        level: 'info',
        format: format,
        transports: [new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: 'log/app.log' })
        ]
    })
}

winston.createLogger({
    transports: [
        new winston.transports.File({

            filename: 'log/error.log',

            level: 'warn',
            filename: 'log/warn.log',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                winston.format.align(),
                winston.format.printf(warn => `${warn.level}: ${[warn.timestamp]}: ${warn.message}`)
            ),
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                winston.format.align(),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
            ),
        }),
    ]
})

module.exports = logger
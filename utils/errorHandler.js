const { error } = require('console');
const winston = require('winston');
const {createLogger, format, transports} = winston;
const {combine, timestamp, printf} = format;

const myformat = printf(({level, message, timestamp}) => {
    return `${timestamp} ${level} ${message}`
})

const logger = createLogger({
    format: combine(
        timestamp(),
        myformat
    ),
    transports: [
        new transports.Console(),
        new transports.MongoDB({ level: 'error', db: process.env.mongoUrl }),

    ]
});

function errorHandler(error, req, res, next) {
    logger.error(error);


    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
    })
}

module.exports = errorHandler;
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
        new transports.File({ filename: 'log/app.log' }),

    ]
});

module.exports = logger;
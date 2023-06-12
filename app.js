const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const cors = require("cors");
const rateLimiter = require('express-rate-limit')
const dotenv = require("dotenv");
// const errorHandler = require('./utils/errorHandler')
const logger =  require('./utils/logger');
const userRoute = require("./routes/userRoutes");


dotenv.config();

const app = express();

mongoose.connect(process.env.mongoUrl)
.then(() => {
    logger.info('connected to db')
}) .catch((err) => {
    logger.error(err.message)
    process.exit(1);
})

const redisClient = redis.createClient(process.env.redis_port, process.env.redis_host);
redisClient.on('error', (err) => {
    logger.error(`Redis error: ${err}`);
})

const limiter = rateLimiter({
	windowMs: 3 * 60 * 1000, // 3 minutes
	max: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Too many requests, please try again later'
})

app.use(limiter);

app.use(cors);
app.use(express.json());

//routes
app.use('/user', userRoute)

// app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info(`Server running at port ${port}`)
})

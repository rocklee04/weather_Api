const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const logger = require('../utils/logger')
const dotenv = require('dotenv');
dotenv.config();


async function login(req, res, next) {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({message: 'Invalid email or password'})
        }

        const matched = await bcrypt.compare(password, user.password);
        if(!matched) {
            return res.status(401).json({message: 'Invalid email or password'})
        }

        const token = jwt.sign({userId: user._id}, process.env.key, {expiresIn: '1d'});

        res.json({token});
    } catch(err) {
        logger.error(err.message);
        next(err);
    }

}

async function register(req, res, next) {
    try {
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({username, email, password: hashedPassword});

        const token = jwt.sign({userId: user._id}, process.env.key, {expiresIn: '1d'});

        res.status(200).json({token});
    } catch(err) {
        logger.error(err.message);
        next(err);         
    }
}

module.exports = {
    login,
    register
}



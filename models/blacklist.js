const redis = require('redis');
const client= redis.createClient(process.env.redis_port);
const {promisify} = require('util')

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

async function blacklistToken(token) {

    try{
        await setAsync(token, 'blacklisted', 'EX', 60*60*6);
    } catch(err) {
        console.log(err);
        throw new Error('error to blacklist token');
    }
}    

async function isTokenBlacklisted(token) {
    try{
        const value = await getAsync(token);
        return value == "blacklisted";
    } catch(err) {
        console.log(err);
        throw new Error('error to check blacklist token');

    }
}


async function removeTokenFromBlacklist(token) {
    try {
        await delAsync(token);
    } catch(err) {
        console.log(err);
        throw new Error('error to remove token from blacklist');
    }
}

module.export = {
    blacklistToken,
    isTokenBlacklisted,
    removeTokenFromBlacklist,
}

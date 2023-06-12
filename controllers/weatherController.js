const axios = require("axios");
const redis = require('redis');
const client = redis.createClient(process.env.redis_port);

const getweather = async (req, res, next) => {
    const city = req.query.city;

    client.get(city, async(err, data) => {
        if(err) {
            console.eror('Error');
        }

        if(data) {
            res.json(JSON.parse(data));

        } else {
            try {
                const res = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.Api_key}`)
            
            } catch(err) {
                console.error(err.message);
            }
        }
    })
}
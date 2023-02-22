const axios = require('axios');
const message = require("../config/Message");
const statusCode = require("../config/statusCode.js")
const errorCode = require("../config/errorCode")
const utils = require("../utils/utils")

module.exports.handler = async (event) => {
    try {
        const headers = {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
        }
        const url = `https://api.replicate.com/v1/predictions/${event.pathParameters.predictionId}`;
        var options = {
            method: 'GET',
            url: url,
            headers,
        }
        const response = await axios.require(options);
        if (response.status !== 200) {
            let error = await response.json();
            res.statusCode = 500;
            res.end(JSON.stringify({ detail: error.detail }));
            return;
        }

        const prediction = await response.json();
        res.end(JSON.stringify(prediction));
        return prediction;
    } catch (err) {
        console.log("Error occured", err);
        return util.sendResponse(500, { message: "Couldn't create this player!" });
    }
}
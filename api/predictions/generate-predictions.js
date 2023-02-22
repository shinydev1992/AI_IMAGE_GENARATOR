const axios = require('axios');
const message = require("../config/Message");
const statusCode = require("../config/statusCode.js")
const errorCode = require("../config/errorCode")
const utils = require("../utils/utils")

module.exports.handler = async (event) => {
    try {
        if (!event.body) {
            return utils.sendResponse(statusCode.BAD_REQUEST, {
                errorCode: errorCode.BAD_REQUEST,
                message: message.BAD_REQUEST
            });
        }
        const reqData = JSON.parse(event.body);
        const body = JSON.stringify({
            version: process.env.REPLICATE_MODEL_VERSION,
            input: reqData,
        });

        const headers = {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
            "User-Agent": `scribble-node/1.0.0`
        }
        const url = 'https://api.replicate.com/v1/predictions';
        var options = {
            method: 'POST',
            url: url,
            headers,
            body
        }

        const response = await axios.request(options);
        if (response.status !== 201) {
            let error = await response.json();
            res.statusCode = 500;
            res.end(JSON.stringify({ detail: error.detail }));
            return;
        }
        const prediction = await response.json();
        res.statusCode = 201;
        res.end(JSON.stringify(prediction));
        return prediction;
    } catch (err) {
        console.log("Error occured", err);
        return util.sendResponse(500, { message: "Couldn't create this player!" });
    }
}
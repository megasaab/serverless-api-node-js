'use strict';

const products = require("../database/products.json");

module.exports.getProductsList = async (event) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(products),
    };
};

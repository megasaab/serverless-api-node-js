'use strict';

const products = require("../database/products.json");

module.exports.getProductsById = async (event) => {
    const productId = event.pathParameters.productId;
    const product = products.find(product => product.id === productId);
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(product),
    };
};
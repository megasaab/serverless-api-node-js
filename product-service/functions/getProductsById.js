'use strict';

const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.getProductsById = async (event) => {
    try {
        const productId = event.pathParameters.productId;

        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {id: productId},
        };

        const result = await docClient.get(params).promise();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(result.Item)
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal Server Error', err: err}),
        };
    }

};
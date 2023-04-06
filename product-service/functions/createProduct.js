'use strict';

const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.createProduct = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        if (!requestBody.name || !requestBody.price || !requestBody.quantity) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'Invalid request body'})
            };
        }

        const newProduct = {
            id: Date.now().toString(),
            name: requestBody.name,
            price: requestBody.price,
            quantity: requestBody.quantity
        };

        await dynamodb.put({
            TableName: process.env.TABLE_NAME, // Replace with your actual DynamoDB table name
            Item: newProduct
        }).promise();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(newProduct)
        };

    } catch (err) {
        console.error('Error creating product:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal Server Error'})
        };
    }
}
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const products = require("../database/products.json");

module.exports.insertData = async (event) => {
    try {
        // Define DynamoDB put parameters for each product
        const putRequests = products.map(product => ({
            PutRequest: {
                Item: {
                    id: product.id,
                    count: product.count,
                    description: product.description,
                    price: product.price,
                    title: product.title,
                },
            },
        }));

        // Use DynamoDB DocumentClient to batch write the items into the table
        await docClient.batchWrite({
            RequestItems: {
                [process.env.TABLE_NAME]: putRequests,
            },
        }).promise();

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Products added successfully' }),
        };
    } catch (error) {
        // Handle any errors that occur during execution
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
}
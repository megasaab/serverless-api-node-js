const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.region });

module.exports.createProduct = async (event) => {
    try {
        const { name, price, stock } = JSON.parse(event.body);

        // Create product
        const productParams = {
            TableName: process.env.PRODUCTS,
            Item: {
                id: AWS.DynamoDB.DocumentClient.uuid(),
                name,
                price,
            },
        };

        await dynamoDB.put(productParams).promise();

        // Create stock
        const stockParams = {
            TableName: process.env.STOCKS,
            Item: {
                product_id: productParams.Item.id,
                count: stock,
            },
        };

        await dynamoDB.put(stockParams).promise();

        // Return created product with stock information
        const productWithStock = { ...productParams.Item, stock: stockParams.Item.count };

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(productWithStock),
        };
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.region });

module.exports.getProductsById = async (event) => {
    try {
        const productId = event.pathParameters.productId;

        const productParams = {
            TableName: process.env.PRODUCTS,
            Key: {
                id: productId,
            },
        };

        const productResult = await dynamoDB.get(productParams).promise();
        const product = productResult.Item;

        if (!product) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Product not found' }),
            };
        }

        const stockParams = {
            TableName: process.env.STOCKS,
            Key: {
                product_id: product.id,
            },
        };

        const stockResult = await dynamoDB.get(stockParams).promise();
        const stock = stockResult.Item ? stockResult.Item.count : 0;

        const productWithStock = { ...product, stock };

        return {
            statusCode: 200,
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
const AWS = require('aws-sdk');

// Set up AWS DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' }); // Update region as per your setup

// Lambda function to get list of products
exports.getProductsList = async (event, context) => {
    try {
        // Query the products table to get products
        const params = {
            TableName:  process.env.PRODUCTS,
        };
        const { Items: products } = await dynamoDB.scan(params).promise();

        // Query the stocks table to get stock counts
        const stocks = {};
        const stockParams = {
            TableName: process.env.STOCKS,
        };
        const { Items: stocksData } = await dynamoDB.scan(stockParams).promise();
        stocksData.forEach(stock => {
            stocks[stock.product_id] = stock.count;
        });

        // Join the products and stocks data
        const productsWithStocks = products.map(product => {
            return {
                ...product,
                count: stocks[product.id] || 0,
            };
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(productsWithStocks),
        };
    } catch (error) {
        console.error('Error getting products list:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error'}),
        };
    }
};
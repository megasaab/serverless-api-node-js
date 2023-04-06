const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const products = require("../database/products.json");

// Set up AWS DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' }); // Update region as per your setup


// Define test data for stocks
const stocks = [
    { product_id: products[0].id, count: 10 },
    { product_id: products[1].id, count: 5 },
    { product_id: products[2].id, count: 20 },
];

const filteredProducts = [];

// Define test data for products
products.forEach((product) => {
    stocks.push({ product_id: product.id, count: product.count });
    filteredProducts.push({
        id: product.id,
        title: product.title,
        description:  product.description,
        price: product.price,
    });
});

// Insert products into "products" table
const insertProducts = async () => {
    for (const product of filteredProducts) {
        const params = {
            TableName: process.env.PRODUCTS,
            Item: product,
        };
        await dynamoDB.put(params).promise();
        console.log(`Product inserted: ${product.id}`);
    }
};

// Insert stocks into "stocks" table
const insertStocks = async () => {
    for (const stock of stocks) {
        const params = {
            TableName: process.env.STOCKS,
            Item: stock,
        };
        await dynamoDB.put(params).promise();
        console.log(`Stock inserted: ${stock.product_id}`);
    }
};

// Execute the script
const executeScript = async () => {
    try {
        await insertProducts();
        await insertStocks();
        console.log('Test data inserted successfully.');
    } catch (error) {
        console.error('Error inserting test data:', error);
    }
};

executeScript();
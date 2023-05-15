const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const docClient = new AWS.DynamoDB.DocumentClient();

exports.catalogBatchProcess = async (event) => {
    const products = event.Records.map((record) => JSON.parse(record.body));
    const productIds = [];

    // Create products in the products table
    for (const product of products) {
        const params = {
            TableName: 'products',
            Item: {
                id: product.productId,
                name: product.productName,
                price: product.price,
            }
        };
        await docClient.put(params).promise();

        productIds.push(product.productId);
    }

    // Publish an event to the SNS topic
    const message = {
        productIds: productIds
    };
    const params = {
        TopicArn: process.env.CREATE_PRODUCT_SNS_TOPIC_ARN,
        Message: JSON.stringify(message)
    };
    await sns.publish(params).promise();
};

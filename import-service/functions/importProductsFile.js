const AWS = require('aws-sdk');
const BUCKET = 'node-in-cloud-s3';

module.exports.importProductsFile = async (event) => {
    try {
        const fileName = event.queryStringParameters.name;
        const s3 = new AWS.S3();
        const params = {
            Bucket: BUCKET,
            Key: `uploaded/${fileName}`,
            Expires: 3600,
        };

        const signedUrl = await s3.getSignedUrlPromise('getObject', params);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': '*',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ signedUrl }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate Signed URL' }),
        };
    }
};
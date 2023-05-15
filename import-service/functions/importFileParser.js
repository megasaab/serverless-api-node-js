const csvParser = require('csv-parser');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

module.exports.importFileParser = async (event) => {
    try {
        const s3 = new AWS.S3();
        const record = event.Records[0];
        const bucketName = record.s3.bucket.name;
        const objectKey = record.s3.object.key;
        const readableStream = s3.getObject({ Bucket: bucketName, Key: objectKey }).createReadStream();
        readableStream
            .pipe(csvParser())
            .on('data', async (data) => {
                const params = {
                    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/363263407374/catalogItemsQueue',
                    MessageBody: JSON.stringify(data),
                };
                await sqs.sendMessage(params).promise();
                console.log(`Sent SQS message: ${JSON.stringify(data)}`);
            })
            .on('end', async () => {
                console.log('File parsing completed');

                const parsedObjectKey = objectKey.replace('uploaded', 'parsed');
                await s3.copyObject({ Bucket: bucketName, CopySource: `${bucketName}/${objectKey}`, Key: parsedObjectKey }).promise();

                await s3.deleteObject({ Bucket: bucketName, Key: objectKey }).promise();

                console.log(`File moved from "${objectKey}" to "${parsedObjectKey}"`);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'File parsed and moved to "parsed" folder' }),
                };
            });
    } catch (error) {
        console.error('Failed to parse file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to parse file' }),
        };
    }
};
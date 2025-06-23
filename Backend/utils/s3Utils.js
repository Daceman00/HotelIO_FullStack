const AWS = require('aws-sdk');
const s3 = require('../config/s3'); // Import the shared S3 config

exports.deleteS3Files = async (keys) => {
    try {
        const objects = keys.map(Key => ({ Key }));
        await s3.deleteObjects({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: { Objects: objects }
        }).promise();
        return true;
    } catch (err) {
        console.error('S3 deletion error:', err);
        throw new Error('Failed to delete files from S3');
    }
};
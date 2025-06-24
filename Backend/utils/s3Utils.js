const AWS = require('aws-sdk');
const s3 = require('../config/s3'); // Import the shared S3 config

exports.deleteS3Files = async (keys) => {
    try {
        const objects = keys.map(Key => ({ Key: Key.trim() })); // Trim whitespace
        const response = await s3.deleteObjects({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: { Objects: objects }
        }).promise();

        // Check for partial failures
        if (response.Errors && response.Errors.length > 0) {
            const errors = response.Errors.map(e => `FAILED: ${e.Key} (${e.Code})`);
            console.error('S3 Partial Deletion Failure:', errors);
            throw new Error(`Partial deletion failure: ${errors.join(', ')}`);
        }

        console.log('S3 Deletion Successful:', response.Deleted.map(d => d.Key));
        return true;
    } catch (err) {
        console.error('S3 Deletion Error:', err);
        throw err; // Propagate error
    }
};
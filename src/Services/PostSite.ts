import AWS from 'aws-sdk';

export const PostSite = async (siteName: string, key: string) => {
    const S3_BUCKET = "sitemaster.beta";
    const REGION = "us-east-1";

    AWS.config.update({
        accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
        region: REGION,
    });

    const s3 = new AWS.S3({
        region: REGION,
    });

    // Convert the siteName object to a JSON string
    const body = JSON.stringify({ siteName });

    const params = {
        Bucket: S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: 'application/json', // Specify the content type
    };

    try {
        await s3.putObject(params).promise();
        console.log("File uploaded successfully.");
    } catch (err) {
        console.error("Error uploading file:", err);
    }
};

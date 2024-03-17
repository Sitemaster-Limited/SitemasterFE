import AWS from 'aws-sdk';

export const GetSites = async (): Promise<{ key: string; siteName: string }[]> => {
    const S3_BUCKET = "sitemaster.beta";
    const REGION = "us-east-1";

    // Update AWS configuration
    AWS.config.update({
        accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
        region: REGION,
    });

    const s3 = new AWS.S3();

    const params = {
        Bucket: S3_BUCKET,
    };

    try {
        const response = await s3.listObjectsV2(params).promise();
        const keys = response.Contents?.map((object) => object.Key as string) || [];

        const sitesData = await Promise.all(keys.map(async (key) => {
            const objectParams = {
                Bucket: S3_BUCKET,
                Key: key,
            };
            try {
                const objectData = await s3.getObject(objectParams).promise();
                // Check if Body exists and is not null before attempting to parse
                if (objectData.Body) {
                    const objectContent = JSON.parse(objectData.Body.toString());
                    return { key: key, siteName: objectContent.siteName };
                } else {
                    console.log(`No content found for key: ${key}`);
                    return { key: key, siteName: "No content" }; // Handle the case where Body is null
                }
            } catch (error) {
                console.error(`Error fetching object with key ${key}:`, error);
                return { key: key, siteName: "Error fetching object" }; // Handle fetch error
            }
        }));

        return sitesData.filter(site => site.siteName !== "No content" && site.siteName !== "Error fetching object"); // Optionally filter out error entries
    } catch (error) {
        console.error("Error fetching S3 objects:", error);
        return []; // Return an empty array in case of error
    }
};

const { Storage } = require('@google-cloud/storage');
const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
require('dotenv').config();

const uriString = process.env.MONGO_URI;

// Connection URI
const uri = 'mongodb+srv://' + uriString;

// Database Name
const dbName = 'jobs-dev';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const storage = new Storage();

async function insertDataToDatabase(bucketName, filename) {
    let jsonData;
    try {
        // Initialize the MongoDB client if not already connected
        await client.connect();
        const db = client.db(dbName);

        if (bucketName !== 'none') {
            // Get file from the Cloud Storage bucket
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(filename);

            // Download the file to a local temporary location
            const tempFilePath = `/tmp/${filename}`;
            await file.download({ destination: tempFilePath });

            // Read the downloaded file
            jsonData = await fs.readFile(tempFilePath, 'utf8');

            // Clean up the temporary file
            await fs.unlink(tempFilePath);
        } else {
            // Read the local file
            jsonData = await fs.readFile(`${filename}.json`, 'utf8');
        }

        const data = JSON.parse(jsonData);

        // Insert data into the MongoDB collection
        const result = await db.collection('Jobs-gcloud').insertMany(data);
        console.log(`${result.insertedCount} documents inserted`);
    } catch (error) {
        console.error('Error inserting data:', error);
    }
    return null;
}



module.exports = insertDataToDatabase;

const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
require('dotenv').config();

const uriString = process.env.MONGO_URI

// Connection URI
const uri = 'mongodb+srv://' + uriString 

// Database Name
const dbName = 'jobs-dev';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function insertDataToDatabase(filename) {
    try {
        await client.connect();
        const db = client.db(dbName);

        const jsonData = await fs.readFile(`${filename}.json`, 'utf8');
        const data = JSON.parse(jsonData);

        const result = await db.collection('Jobs-gcloud').insertMany(data);
        console.log(`${result.insertedCount} documents inserted`);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        await client.close();
    }
}
module.exports = insertDataToDatabase;
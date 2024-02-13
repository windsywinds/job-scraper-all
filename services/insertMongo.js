const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
require('dotenv').config();


// Connection URI
const uri = process.env.MONGO_URI;

// Database Name
const dbName = 'jobs-dev';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function insertDataFromFile(filename) {
    try {
        await client.connect();
        const db = client.db(dbName);

        const jsonData = await fs.readFile(`${filename}.json`, 'utf8');
        const data = JSON.parse(jsonData);

        const result = await db.collection('Jobs-test').insertMany(data);
        console.log(`${result.insertedCount} documents inserted`);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        await client.close();
    }
}
module.exports = insertDataFromFile;
const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
require('dotenv').config();

const uriString = process.env.MONGO_URI || 'jobs-dev-user:REMOVED.z2lud.mongodb.net/jobs-dev?retryWrites=true&w=majority'

// Connection URI
const uri = 'mongodb+srv://' + uriString 

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
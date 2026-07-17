const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

async function run() {
  console.log("URI starts with:", uri.substring(0, 20));

  const client = new MongoClient(uri);

  try {
    await client.connect();

    console.log("✅ Connected!");

    const admin = client.db().admin();
    const result = await admin.ping();

    console.log(result);
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
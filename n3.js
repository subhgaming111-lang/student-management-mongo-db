const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
app.use(express.json());
const client = new MongoClient("mongodb://localhost:27017/");
async function start() {
  await client.connect();
  const db = client.db("collegeDB");
  app.get("/health", async (req, res) => {
    await db.command({ ping: 1 });
    res.json({ status: "ok", mongodb: "connected", database: "collegeDB" });
  });
  app.listen(3000, () => console.log("Health API running"));
}
start().catch((e) => { console.error(e); process.exit(1); });

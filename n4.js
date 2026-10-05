const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const client = new MongoClient("mongodb://localhost:27017/");
async function start() {
  await client.connect();
  const students = client.db("collegeDB").collection("students");
  app.get("/student-demo", (req, res) => res.json({
    studentNo: "ST001", name: "Rahul Patel", branch: "CE"
  }));
  app.get("/students", async (req, res) => res.json(await students.find({}).toArray()));
  app.listen(3000, () => console.log("GET /students"));
}
start().catch((e) => { console.error(e); process.exit(1); });

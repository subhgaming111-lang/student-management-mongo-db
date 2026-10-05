const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
app.use(express.json());
app.use(express.static("public"));
const client = new MongoClient("mongodb://localhost:27017/");
async function start() {
  await client.connect();
  const db = client.db("collegeDB");
  const students = db.collection("students");
  await students.createIndex({ studentNo: 1 }, { unique: true });
  app.get("/health", async (req, res) => {
    await db.command({ ping: 1 });
    res.json({ status: "ok", mongodb: "connected", database: "collegeDB" });
  });
  app.get("/students", async (req, res) => {
    res.json(await students.find({}).sort({ studentNo: 1 }).toArray());
  });
  app.post("/students", async (req, res) => {
    try {
      const r = await students.insertOne(req.body);
      res.status(201).json({ message: "created", insertedId: r.insertedId });
    } catch (e) {
      res.status(400).json({ message: "Student No already exists or data invalid" });
    }
  });
  app.put("/students/:id", async (req, res) => {
    const r = await students.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.json({ message: "updated", modifiedCount: r.modifiedCount });
  });
  app.delete("/students/:id", async (req, res) => {
    const r = await students.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "deleted", deletedCount: r.deletedCount });
  });
  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
}
start().catch((e) => { console.error(e); process.exit(1); });

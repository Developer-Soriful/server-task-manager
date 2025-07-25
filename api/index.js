import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
let tasksCollection;
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("todo");
        tasksCollection = database.collection("tasks");
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (err) {
        console.log(err);
    }
}
run().catch(console.dir);
// this is for update tasks 
app.put('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const updateData = req.body;
    const options = { upsert: true };
    const updatedDoc = {
        $set: updateData,
    };
    const result = await tasksCollection.updateOne(query, updatedDoc, options);
    res.send(result);
})
// this is for delete tasks
app.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await tasksCollection.deleteOne(query);
    res.send(result);
})
// this is for get tasks
app.get('/tasks', async (req, res) => {
    const result = await tasksCollection.find().toArray();
    res.send(result);
})
// this is for post tasks
app.post('/tasks', async (req, res) => {
    const task = req.body;
    const result = await tasksCollection.insertOne(task)
    res.send(result);
})


app.get('/', (req, res) => {
    res.send('Project is running')
})

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})

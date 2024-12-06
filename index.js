const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000
const app = express()

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


// KM9d4l5tobndZ5ac 
// SportsSpar



const uri = "mongodb+srv://SportsSpar:KM9d4l5tobndZ5ac@cluster0.xihi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const UserCollection = client.db('UsersDB').collection('users');

    app.get('/user', async (req, res) => {
      const cursor = UserCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.post('/user' , async (req, res)=>{
      const newUser = req.body;
      const result = await UserCollection.insertOne(newUser);
      res.send(result)
    });



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
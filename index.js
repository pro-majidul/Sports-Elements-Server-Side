const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
const app = express()

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})





const uri = `mongodb+srv://${process.env.User_Name}:${process.env.User_Pass}@cluster0.xihi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const ProductCollection = client.db('UsersDB').collection('products');

    app.get('/user', async (req, res) => {
      const cursor = UserCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/user/:email', async (req, res) => {

      const email = req.params.email;
      const query = { email: email };
      const result = await UserCollection.findOne(query);
      res.send(result)

    })

    app.post('/user', async (req, res) => {
      const newUser = req.body;
      const result = await UserCollection.insertOne(newUser);
      res.send(result)
    });

    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email }
      const options = { upsert: true };
      const updateInfo = {
        $set: {
          name: user.name,
          email: user.email,
          photo: user.photo
        }
      }
      const result = await UserCollection.updateOne(query, updateInfo, options);
      res.send(result)
    })


    app.get('/product', async (req, res) => {
      const cursor = ProductCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await ProductCollection.findOne(query);
      res.send(result)
    })

    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      const result = await ProductCollection.insertOne(newProduct);
      res.send(result)
    });


    app.patch('/product/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const query = { _id: new ObjectId(id) };
      const UpdateProduct = {
        $set: {
          price: product.price
        }
      }
      const result = await ProductCollection.updateOne(query, UpdateProduct)
      res.send(result)
    })




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
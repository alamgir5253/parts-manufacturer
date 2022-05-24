const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 5000
const app = express()
// middle ware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r8qzj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
  try {
    await client.connect()
  const partsCollection = client.db("bike-parts").collection("parts");
  const orderCollection = client.db("bike-parts").collection("order");
  const reviewCollection = client.db("bike-parts").collection("review");
  const profileCollection = client.db("bike-parts").collection("profile");

  app.get('/parts', async(req, res) =>{
    const query ={}
    const result = await partsCollection.find(query).toArray()
    res.send(result)
  })

  app.get('/parts/:id', async(req, res) =>{
    const id = req.params.id
    const query = {_id: ObjectId(id)}
    const part = await partsCollection.findOne(query)
    res.send(part)
  })
//  post to order collection 
  app.post('/order', async(req, res) =>{
    const order = req.body
    const result = await orderCollection.insertOne(order)
    res.send(result)
  })

  // get user order by email api 
  app.get('/order', async(req, res) =>{
     const email = req.query.email
     const query ={email:email}
     const order =await orderCollection.find(query).toArray()
     res.send(order)

  })

  // post to review collection 
  app.post('/review', async(req, res) =>{
    const review = req.body
    const result = await reviewCollection.insertOne(review)
    res.send(result)
  })

  app.get('/review', async(req, res) =>{
    const query ={}
    const result = await reviewCollection.find(query).toArray()
    res.send(result)
  })

  // post to profile collection 
  app.post('/profile', async(req, res) =>{
    const detail = req.body
    const result = await profileCollection.insertOne(detail)
    res.send(result)
  })
   
  }
  finally {
    // client.close();

  }
}
run().catch(console.dir)









app.get('/', (req, res) => {
  res.send(' process success')
})
app.listen(port, () => {
  console.log('listening to portt', port);
})

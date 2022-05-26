const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 5000
const app = express()
// middle ware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r8qzj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function VerifyJWT(req, res, next){
  const authorize = req.headers.authorization
  if(!authorize){
    return res.status(401).send({massage:'unauthorize accesses'})
  }
  const token = authorize.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
  if(err){
    return res.status(403).send({massage:'forbidden accesses'})
  }
  req.decoded = decoded
  next()    


  })

}


async function run() {
  try {
    await client.connect()
  const partsCollection = client.db("bike-parts").collection("parts");
  const orderCollection = client.db("bike-parts").collection("order");
  const reviewCollection = client.db("bike-parts").collection("review");
  const profileCollection = client.db("bike-parts").collection("profile");
  const userCollection = client.db("bike-parts").collection("user");

  app.get('/parts', async(req, res) =>{
    const query ={}
    const result = await partsCollection.find(query).toArray()
    res.send(result)
  })
  // insert parts to parts collection 
  app.post('/parts', async(req, res) =>{
    const part = req.body
    const result = await partsCollection.insertOne(part)
    res.send(result)
  })
  // delete parts 
  app.delete('/parts/:id', async(req,res) =>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)}
    const result = await partsCollection.deleteOne(query)
    res.send(result)
  })


  app.get('/parts/:id', async(req, res) =>{
    const id = req.params.id
    const query = {_id: ObjectId(id)}
    const part = await partsCollection.findOne(query)
    res.send(part)
  })

  // get all orders to display in all order page 
  app.get('/allorder', async(req, res) =>{
    const query = {}
    const orders = await orderCollection.find(query).toArray()
    res.send(orders)
  })
//  post to order collection 
  app.post('/order', async(req, res) =>{
    const order = req.body
    const result = await orderCollection.insertOne(order)
    res.send(result)
  })

  // get user order by email api 
  app.get('/order', VerifyJWT, async(req, res) =>{
     const email = req.query.email
     const decodedEmail = req.decoded.email
     if(email === decodedEmail){
      const query ={email:email}
      const order =await orderCollection.find(query).toArray()
      return res.send(order)
     }else{
      return res.status(403).send({massage:'forbidden accesses'})
     }
     

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

  // get all user to dashboard alluser page 
  app.get('/user', VerifyJWT, async(req, res) =>{
    const query = {}
    const result = await userCollection.find(query).toArray()
    res.send(result)
  })

  // put to user collection 
  app.put('/user/:email', async(req,res) =>{
    const email = req.params.email
    const user = req.body
    const filter = {email:email}
    const options ={upsert: true}
    const updateDoc = {
      $set:user
    }
    const result = await userCollection.updateOne(filter,updateDoc,options)
    const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);
    res.send({result, token})
  })

  // admin api 
  app.put('/user/admin/:email', VerifyJWT, async(req,res) =>{
    const email = req.params.email
    const request = req.decoded.email
    const account = await userCollection.findOne({email:request})
    if(account.role === 'admin'){
      const filter = {email:email}
      const updateDoc = {
        $set:{role:'admin'}
      }
      const result = await userCollection.updateOne(filter,updateDoc)
      res.send(result)
    }else{
      return res.status(403).send({massage:'forbidden accesses'})
     }
   
  })

  app.get('/admin/:email', async(req, res)=>{
     const email= req.params.email
     const user= await userCollection.findOne({email: email})
     const isAdmin = user.role === 'admin'
     res.send({admin: isAdmin})
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

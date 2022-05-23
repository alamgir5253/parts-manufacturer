const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000
const app = express()
// middle ware 
app.use(cors())
app.use(express.json())

async function run() {
  try {
   
  }
  finally {
    // client.close();

  }
}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send(' process successssss')
})
app.listen(port, () => {
  console.log('listening to portt', port);
})
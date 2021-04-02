const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()
const PORT = 5000

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gw0op.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('hello world')
})

client.connect(err => {
    console.log("Database connected...");
    const collection = client.db("PlayMart").collection("games");

    // Post data
    app.post('/addGames', (req, res) => {
        const pd = req.body;
        collection.insertMany(pd)
            .then(result => { 
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
    })

    // Get Data
    app.get('/getGames', (req, res) => {
        collection.find({token: req.query.token})        
            .toArray((err, doc) => {
                res.send(doc);
            })
    })

    // Delete Data
    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        collection.deleteOne({_id: ObjectId(req.params.id)})
        .then(res => {
            console.log(res);
        })
    })

    // Update data
    app.patch('/update/:id', (req, res) => {
        collection.updateOne({_id: ObjectId(req.params.id)}, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                discount: req.body.discount,
                released: req.body.released
            }
        })
        .then(result => {
            console.log(result);
        })
    })
});

app.listen(PORT)
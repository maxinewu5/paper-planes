const express = require('express')
const bodyParser= require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

//using config.env to set the variables 
require("dotenv").config({ path: "./config.env" });

//setup mongo client
const MongoClient = require('mongodb').MongoClient

var dev_db_url;
var mongoDB= process.env.MONGODB_URI || dev_db_url;
console.log("connected to mongodb on " + mongoDB);

var db;
var messageCollection;
var curtags = [];
var usertags = [];

MongoClient.connect(mongoDB, {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.error(err)
    console.log('connected to mongodb')
    db = client.db('paper-planes')
    messageCollection = db.collection('messages')
})

app.get('/', (req, res) => {
    //res.render('index.ejs')
    res.sendFile(__dirname + '/index.html')
})

app.post('/plane', (req, res) => {
    curtags = req.body.tags.split(" ");
    usertags = usertags.concat(curtags)
    req.body.tags = curtags;
    messageCollection.insertOne(req.body) 
        .then(result => {
            console.log(result)
            res.redirect('/')
        })
        .catch(error => console.error(error))
})

app.get('/pickup', (req, res) => {
    console.log("pickup")
    db.collection('messages').find({"tags":{ $in: usertags} }).toArray()
    .then(results => {
        res.render('pickup.ejs', { messages: results})
    })
    .catch(error => console.error(error))
})

app.listen(process.env.PORT || 3000, function() {
    console.log('listening on ' + (process.env.PORT || 3000))
})

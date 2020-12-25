const express = require('express')
const bodyParser= require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


const MongoClient = require('mongodb').MongoClient

//var process.env.MONGODB_URI = "mongodb+srv://maxinewu:SoxDLldTwouxDLYc@cluster0.t34vh.mongodb.net/paper-planes?retryWrites=true";
//var MONGODB_URI = "mongodb+srv://maxinewu:SoxDLldTwouxDLYc@cluster0.t34vh.mongodb.net/paper-planes?retryWrites=true";
//var dev_db_url = 'mongodb+srv://maxinewu:NvA0pnjzOrLOlZm1@cluster0.3jbgg.mongodb.net/paper-planes?retryWrites=true&w=majority';
//var mongoDB = process.env.MONGODB_URI || dev_db_url;
var mongoDB = "mongodb+srv://maxinewu:SoxDLldTwouxDLYc@cluster0.t34vh.mongodb.net/paper-planes?retryWrites=true";
console.log("connected to mongodb on " + mongoDB);

MongoClient.connect(mongoDB, {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.error(err)
    console.log('connected to mongodb')
    const db = client.db('paper-planes')
    const messageCollection = db.collection('messages')
    var curtags = [];
    var usertags = [];

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
})

app.listen(process.env.PORT || 3000, function() {
    console.log('listening on ' + (process.env.PORT || 3000))
})

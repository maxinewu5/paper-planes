//console.log('send a paper plane today')

const express = require('express')
const bodyParser= require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


const MongoClient = require('mongodb').MongoClient
//mongdb credentials:
//username: maxinewu
//password: NvA0pnjzOrLOlZm1

MongoClient.connect('mongodb+srv://maxinewu:NvA0pnjzOrLOlZm1@cluster0.3jbgg.mongodb.net/paper-planes?retryWrites=true&w=majority', {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.error(err)
    console.log('connected to mongodb')
    const db = client.db('paper-planes')
    const messageCollection = db.collection('messages')
    var curtags = [];
    var usertags = [];

    app.get('/', (req, res) => {
        //console.log("redirected")
        //console.log(results)
        //res.render('index.ejs')
        res.sendFile(__dirname + '/index.html')
    })

    app.post('/plane', (req, res) => {
        //console.log(req.body)
        curtags = req.body.tags.split(" ");
        usertags = usertags.concat(curtags)
        console.log(usertags)
        req.body.tags = curtags;
        messageCollection.insertOne(req.body) 
            .then(result => {
                console.log(result)
                res.redirect('/')
            })
            .catch(error => console.error(error))
    })

    app.get('/pickup', (req, res) => {
        db.collection('messages').find({"tags":{ $in: usertags} }).toArray()
        .then(results => {
            console.log(results)
            res.render('pickup.ejs', { messages: results})
        })
        .catch(error => console.error(error))
    })
})

app.listen(3000, function() {
    console.log('listening on 3000')
})

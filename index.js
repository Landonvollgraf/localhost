const express = require('express');
const path = require('path');
var mongodb= require('mongodb');
const bodyParser = require('body-parser');
var MongoClient=mongodb.MongoClient
var url='mongodb://localhost:27017/'
const { kStringMaxLength } = require('buffer');
const app = express();

const ejs = require('ejs');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(6969, ()=>{
    console.log('App listening on port-- 6969');
    console.log('Check localhost:6969')
});


app.get('/signup', (req,res) => { 
    res.render('SignUp');
});
app.get('/upload', (req,res) => { 
    res.render('Upload');
});
app.get('/login', (req,res) => { 
    res.render('Login');
});

MongoClient.connect(url,function(error, databases) {
    if(error){
        throw error
    }
var dbobject=databases.db('Landon')
console.log("databases is up and runing")
databases.close()
})

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Landon');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})


const websiteSchema = {
    image: String,
    item: String,
    price: String,
    owner: String,
    Description: String
}

const Website = mongoose.model('websites', websiteSchema);

app.get('/', (req, res) => {
    Website.find({}, function(err , Websites) {
        res.render('index', {
            websiteList: Websites
        })
    })
});

app.get("/search", (req, res) => {
    var value = req.query.search;
    Website.find({item:value}, function(err, Websites) {
        res.render('index', {
            websiteList: Websites
        })
    })
})

app.get("/editform", async(req,res) => {
    var id = req.query.id;
    if(id != undefined) {
        const result = await Website.findById(id);
        //console.log(result);
        res.render('Edit', {website: result});
    }
    else {
        res.render('Edit', {website: ""})
    }
});

app.post("/edit", (req,res) => {
    res.redirect(`/editform/?id=${req.body.id}`);
});

app.post("/editform", (req,res) => {
    Website.findByIdAndUpdate(req.body._id, req.body, (err) => {
        if(err){
            throw err
        }
    })
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    console.log(req.body.id);
    Website.findByIdAndRemove(req.body.id, (err, docs) => {
        if(err){
            throw err
        }
        
    })
    res.redirect("/");
});

app.post('/formsub',function (req,res){
    var fname= req.body.fname;
    var lname= req.body.lname;
    var owner= req.body.owner;
    var mnumber = req.body.mnumber;
    var p1 = req.body.p1;


    var data = {
        "fname": fname,
        "lname": lname,
        "owner": owner,
        "mnumber":mnumber,
        "p1":p1
    }

    db.collection('Website').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
    res.redirect("/");
});
app.post('/formupload',function (req,res){
    var image = req.body.image;
    var item= req.body.item;
    var price= req.body.price;
    var owner= req.body.owner;
    var Description = req.body.Description;

    var data = {
        "image": image,
        "item": item,
        "price": price,
        "owner":owner,
        "Description":Description,
       

    }
    db.collection('websites').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
    res.redirect("/")
});









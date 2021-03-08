//imports
const fetch=require('node-fetch');
//const config = require('./config');
var alert=require('alert-node')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

//routes
var signup=require('./routes/signup');
var signup-key=require('./routes/signup-key');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//mongoose setup
const mongoose = require('mongoose');
//You need to have an account created ib mongoose and use connect url directly
mongoose.connect('mongodb+srv://+process.env.username+:+process.env.pswd+@cluster0.l9atb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connect');
});

//default
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname + '/public'));

//Tables Schema
var userSchema = new mongoose.Schema({
  username: { type: String }
  , password: {type: String}
  , name: { type: String }
});
var User = mongoose.model('User', userSchema);
var username;

app.use('/', signup);

app.post('/sign-up-complete1', function (req,res) {
    console.log("going to this function only")
    const params = {
        method: 'post',
        body: {
            merchantCustomerId: req.body.username,
            locale: 'en_US',
            firstName: req.body.name,
            lastName: req.body.lname,
            email: req.body.username,
            phone: req.body.phone
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.id_key,
            'Simulator': '\'EXTERNAL\''
        }
    }

    url = "https://api.test.paysafe.com/paymenthub/v1/customers";
    fetch(url, params).then((response) => {
        return response.json();
      response.render(signup-key,response.json());
    }).then((data) => {
        console.log(data);
    })
    /*
    if(1) {
        User.find({username : req.body.username},function(err, items) {
            if (err) return console.error(err);
            if (items.length>0) {
                console.log("user found")
                res.render('https://hosted.test.paysafe.com/checkout/v2/paysafe.checkout.min.js');
            }
            else{
                var user = new User({
                    username: req.body.username
                    , password: req.body.phone
                    , name: req.body.name
                });
                user.save(function (err, use) {
                    if (err) return console.error(err);
                    alert("Account created");
                });
                username = req.body.username;
                res.render('https://hosted.test.paysafe.com/checkout/v2/paysafe.checkout.min.js');
            }
        });
    }

    else{
        var user = new User({
            username: req.body.username
            , password: req.body.phone
            , name: req.body.name
        });
        user.save(function (err, use) {
            if (err) return console.error(err);
            alert("Account created");
        });
        username = req.body.username;
        res.render('https://hosted.test.paysafe.com/checkout/v2/paysafe.checkout.min.js');
    }

     */
});
app.post("/sign-up-complete",function(req,res){

    const customerId = req.body.username;
    const firstName = req.body.name;
    const lastName = req.body.lname;
    const phone = req.body.phone;
    const email = req.body.username;

    const body = JSON.stringify( {
        merchantCustomerId : customerId,
        locale : 'en_US',
        firstName : firstName,
        lastName : lastName,
        email : email,
        phone : phone
    })

    req({
        method: 'POST',
        url: 'https://api.test.paysafe.com/paymenthub/v1/customers',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Basic  cHJpdmF0ZS03NzUxOkItcWEyLTAtNWYwMzFjZGQtMC0zMDJkMDIxNDQ5NmJlODQ3MzJhMDFmNjkwMjY4ZDNiOGViNzJlNWI4Y2NmOTRlMjIwMjE1MDA4NTkxMzExN2YyZTFhODUzMTUwNWVlOGNjZmM4ZTk4ZGYzY2YxNzQ4',",
            'Simulator': '\'EXTERNAL\''
        },
        body:body
    }, function (error, response, body) {
        console.log('Status:', response.statusCode);
        console.log('Headers:', JSON.stringify(response.headers));
        console.log('Response:', body);
    });
});

function getCurTime(){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let CurTime=year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    return CurTime;
}

module.exports = app;


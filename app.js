//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const md5 = require('md5')

const app = express()
const port = process.env.PORT || 8080

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

// To do

// DB Connect
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true})

// Schema -> modified for encryption
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

// Model
const User = mongoose.model("User", userSchema)


app.get("/", function(req, res) {
    res.render("home")
})

app.get("/login", function(req, res) {
    res.render("login")
})

app.get("/register", function(req, res) {
    res.render("register")
})

//Hashing
app.post("/register", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = User({email: username, password: md5(password)})
    newUser.save(function(err) {
        if (!err) {
            console.log('User Registered Successfully')
            res.render("secrets")
        } else {
            console.log('User couldnt be registered successfully.')
        }
    });
})

// Hashing check
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, result) {
        if (!err) {
            // console.log(result);
            if (result) {
                if (result.password === md5(password)) {
                    console.log("User successfully logged in");
                    res.render('secrets')
                } else {
                    console.log("Username or password is incorrect.")
                }
            } else {
                console.log("Username or password is incorrect.")
            }
        } else {
            console.log(err)
        }
    })
})


app.listen(port, function() {
    console.log(`Server up and running, and listening on port ${port}.`)
})
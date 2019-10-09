//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;

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
    bcrypt.hash(password, saltRounds, function(err, hash) {
        const newUser = User({email: username, password: hash})
        newUser.save(function(err) {
            if (!err) {
                console.log('User Registered Successfully')
                res.render("secrets")
            } else {
                console.log('User couldnt be registered successfully.')
            }
        });
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
                bcrypt.compare(password, result.password, function(err, res0) {
                    // res == true
                    if (res0 == true) {
                        console.log("User successfully logged in");
                        res.render('secrets')
                    } else {
                        console.log("Username or password is incorrect.")
                    }
                });
                // vvvv
                // if (result.password === password) {
                //     console.log("User successfully logged in");
                //     res.render('secrets')
                // } else {
                //     console.log("Username or password is incorrect.")
                // }
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
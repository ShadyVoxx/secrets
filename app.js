//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrpyt = require("mongoose-encryption");


const app = express();

const secret = process.env.SECRET;


app.use(express.static("public"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB',{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrpyt, {

    secret: secret,
  
    encryptedFields: ["password"],
  
    excludeFromEncryption: ["email"],
  
  });
  
  
const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

/////////////// !!POST REQUESTS!! ///////////////

app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
    .then(()=>{
        console.log('Succesful!');
        res.render("secrets");})
    .catch((err)=>{console.log(err);});
});

app.post("/login", async function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username})
    .then((user)=>{

        if (user.password===password){
            res.render("secrets");
            console.log(user.password);
        }
        else{
            res.send("Wrong Credentials!")
        }
    })
    .catch((err)=>{console.log(err);});
});

app.listen(3000,function(){
    console.log("Server running on Port 3000");
})
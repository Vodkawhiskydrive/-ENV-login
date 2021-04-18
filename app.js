require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const encrypt = require('mongoose-encryption');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({ 
    email: String ,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User=mongoose.model("User", userSchema)

app.get("/",function(req,res){
    res.render('home')
})

app.get("/login",function(req,res){
    res.render('login')
})


app.post("/login",function(req,res){

    User.findOne({email:req.body.username},function(err,foundUser){
        
        if (err){
            console.log(err);
        }else{
            if (foundUser){
                if (foundUser.password === req.body.password){
                console.log("Log in successfully");
                res.render("secrets")
                }else{
                console.log("Found user but wrong password!");   
                }
            }else{
                console.log("Wrong email or password!");
            }
        }
    })

})

app.get("/register",function(req,res){
    res.render('register')
})

app.post("/register",function(req,res){
    const applicant = new User({ 
        email: req.body.username,
        password: req.body.password
    });
    applicant.save(function(err){
        if (!err){
            console.log("add user successfully!");
            res.render("secrets")
        }else{
            console.log(err);
        }
    })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

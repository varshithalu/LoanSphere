const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const Port=5000
const app=express();
const MONGO_UR="mongodb://localhost:27017//formApplicaton"
const bcryptjs = require("bcryptjs");


app.use(cors())
app.use(express.json())
mongoose.connect(MONGO_UR)
const db=mongoose.connection;
db.on('error',(error)=>{
    console.error("mongodb connection error",err)
})
db.once('open',()=>{
    console.log('Mongodb is connected')

})
const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String
})
const User=mongoose.model('User',userSchema)

app.Listen(PORT)
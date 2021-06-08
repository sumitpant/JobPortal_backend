const express=require('express');
const app=express();
const route=require('./Routes/route');
const cors=require('cors');
const parser=require('body-parser')
app.use(cors());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }))
app.use(route);






app.listen(3030,()=>{
    console.log('Working')
})
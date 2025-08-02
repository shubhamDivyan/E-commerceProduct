const express=require("express");
const app=express();
// const product=require("./Models/product");

const fs=require("fs");
const path=require("path")
const filePath=path.join(__dirname,"product.json");

const connectDB=require('./config/db');
const product = require("./Models/product");
//Connect DB
connectDB()

app.use(express.json());

function readProduct(){
    fs.writeFileSync(filePath,"[]");
    const data=fs.readFileSync(filePath,utf-8);
    return JSON.parse(data);
}

function writeProduct(product){
    fs.writeFileSync(filePath,JSON.stringify(product))
}

app.get('/product',(req,res)=>{
    const product=readProduct();
    res.json(product)
})

app.post('/product',(req,res)=>{
    const {name,category,price,instock}=req.body;

    if(!name || !category || !price || !instock){
        res.status(400).json({message:"Please fill all Field"});
    }

    const product=readProduct();
    const newProduct={
        id: Date.now(),
        name,
        category,
        price,
        instock,
    }

    product.push(newProduct);
    writeProduct(product);

    res.status(201).json(newProduct);
})

app.delete("/product/:id",(req,res)=>{
    const productId=paresInt(req.params.id);
    let product=readProduct();

    const index=tasks.findIndex(t=>t.id===productId);
    if(index===-1)
        return res.status(404).json({message:"Product Not Found"})
    const deleted=product.splice(index,1);
    writeProduct(tasks);
    res.json(deleted[0]);
})

app.use((req,res)=>{
    res.status(404).json({message:"404 Not Found"});
})



app.listen("8080",()=>{
    console.log("Server is Running on PORT 8080...")
})
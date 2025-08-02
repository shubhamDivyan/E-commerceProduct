const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "product.json");

const connectDB=require('./config/db');
connectDB();
app.use(express.json());


function readProduct() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]"); // Create empty array file if not exist
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}


function writeProduct(product) {
    fs.writeFileSync(filePath, JSON.stringify(product, null, 2));
}


app.get('/product', (req, res) => {
    const products = readProduct();
    res.json(products);
});

app.post('/product', (req, res) => {
    const { name, category, price, instock } = req.body;

    if (!name || !category || !price || !instock) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    const products = readProduct();
    const newProduct = {
        id: Date.now(),
        name,
        category,
        price,
        instock,
    };

    products.push(newProduct);
    writeProduct(products);

    res.status(201).json(newProduct);
});

app.delete("/product/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    let products = readProduct();

    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
        return res.status(404).json({ message: "Product Not Found" });
    }

    const deleted = products.splice(index, 1);
    writeProduct(products);

    res.json(deleted[0]);
});


app.use((req, res) => {
    res.status(404).json({ message: "404 Not Found" });
});


app.listen(8080, () => {
    console.log("Server is Running on PORT 8080...");
});

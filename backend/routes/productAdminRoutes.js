const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//product admin routes
// get all products
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error"});
  }
});
//create new product
router.post("/",protect,admin, async(req, res) =>{
    try {
        const {
             name,
             description,
             price,
             discountPrice,
             countInStock,
             category,
             brand,
             sizes,
             colors,
             collections,
             material,
             images,
            //  isFeatured,
            //  isPublished,
            //  tags,
            //  dimensions,
            //  weight,
             sku,
        } = req.body;
    const product = new Product(
        {
            name,
             description,
             price,
             discountPrice,
             countInStock,
             category,
             brand,
             sizes,
             colors,
             collections,
             material,
             images,
            //  isFeatured,
            //  isPublished,
            //  tags,
            //  dimensions,
            //  weight,
             sku,
             user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error){
        console.error(error);
        res.status(500).send("Server Error");
    }
});


module.exports = router;

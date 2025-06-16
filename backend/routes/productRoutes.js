const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

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
             isFeatured,
             isPublished,
             tags,
             dimensions,
             weight,
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
             isFeatured,
             isPublished,
             tags,
             dimensions,
             weight,
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

router.put("/:id", protect, admin, async (req,res) =>{
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
             isFeatured,
             isPublished,
             tags,
             dimensions,
             weight,
             sku,
        } = req.body;

        //find product by id
        const product = await Product.findById(req.params.id);

        if(product){
            //update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice =  discountPrice|| product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.images = images || product.images;
            product.isFeatured =
             isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = 
            isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
             product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
             product.sku = sku || product.sku;

            //save the updated product
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }else{
            res.status(404).json({ message: "Product not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        
    }
});

//delete product by id
router.delete("/:id", protect, admin, async(req, res) => {
    try{
        //find product by id
        const product = await Product.findById(req.params.id);

        if (product){
            //remove product from db
            await product.deleteOne();
            res.json({message: "Product removed"});
        } else{
            res.status(404).json({message: "Product not found "});
        }

    }catch(error){
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//get all products by filtering
router.get("/", async(req,res) =>{
    try {
        const{
            collection,
            size,
            color,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit,
        } = req.query;

        let query = {};

        //filter logic
        if(collection && collection.toLocaleLowerCase() !== "all"){
            query.collections = collection;
        }
        if(category && category.toLocaleLowerCase() !== "all"){
            query.category = category;
        }

        if(material) {
            query.material = { $in: material.split(",")};

        }
        if(brand) {
            query.brand = { $in: brand.split(",")};

        }
        if(size) {
            query.sizes = { $in: size.split(",")};
        }
        if(color) {
            query.colors = { $in: [color]};

        }
        if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                {name: {$regex: search, $options: "i"} },
                {description: {$regex: search, $options: "i"} },
            ];
        }

        //sort by
        let sort = {};
        if(sortBy) {
            switch (sortBy) {
                case "priceAsc": 
                sort = { price: 1};
                break;
                 case "priceDesc": 
                sort = { price: -1};
                break;
                 case "popularity": 
                sort = { rating: -1};
                break;
                default:
                    break;
            }
        }

        //fetch product and sort limit
        let products = await Product.find(query)
        .sort(sort)
        .limit(Number(limit) || 0);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//get best seller with highest rating
router.get("/best-seller", async(req, res) =>{
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1});
        if(bestSeller){
            res.json(bestSeller);
        }else{
            res.status(404).json({ message: "No best seller found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        
    }
});

//latest 8 produts new arrivals
router.get("/new-arrivals", async(req, res) => {
    try {
        //fetch latest 8 products
        const newArrivals = await Product.find().sort({ createdAt: -1}).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");   
    }
});


//get single products
router.get("/:id", async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            console.log(error);
            res.status(500).send("Server Error");
        }
    } catch (error) {
        
    }
});

//similar products
router.get("/similar/:id", async (req, res) =>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({ message: "Product Not Found"});
        }

        const similarProducts = await Product.find({
            _id: { $ne: id },
            category: product.category,
        }).limit(4);
        res.json(similarProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// GET distinct filter options for sidebar
router.get("/filters/options", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const sizes = await Product.distinct("sizes");
    const colors = await Product.distinct("colors");
    const materials = await Product.distinct("material");
    const brands = await Product.distinct("brand");

    res.json({
      categories,
      sizes,
      colors,
      materials,
      brands,
    });
  } catch (error) {
    console.error("Failed to fetch filter options", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/products/:id/review
// @desc    Add a review for a product
// @access  Private
router.put("/:id/review", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Create review object
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    // Push to reviews array
    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Calculate new average rating
    product.averageRating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// @route   DELETE /api/products/:productId/review/:reviewId
// @desc    Admin can delete any review
// @access  Private/Admin
router.delete("/:productId/review/:reviewId", protect, admin, async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const reviewIndex = product.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found" });
    }

    product.reviews.splice(reviewIndex, 1);
    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length || 0;

    await product.save();
    res.json({ message: "Review deleted successfully by admin" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
const express = require("express"); //import express
const Product = require("../models/productModel");
const mongoose = require("mongoose");

const router = express.Router();

// Handles our get requests for all profucts
router.get("/", (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then( docs => {
        const response ={
          count: docs.length,
          products: docs.map(doc =>{
            return{
              name: doc.name,
              price: doc.price,
              _id: doc._id,
              request: {
                type: 'GET',
                url: 'http://localhost:5000/products/' + doc.id
              }
            }
          })
        }
        res.status(200).json(response);
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({error: err});
    })
});

// Handles our post methods
router.post("/", (req, res, next) => {
  // New instant of our schema
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  // Save to the database
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product created Successfully!",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:5000/products/" + result._id
          }
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// GET A REQUEST FOR A SINGLE PRODUCTS
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
  .select('name price _id')
    .exec()
    .then((doc) => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid entry found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// We had a patch methods

router.patch("/:productId", (req, res, next) => {
    const id =  req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
  Product.update({_id: id}, {$set: updateOps})
  .exec()
  .then( result =>{
      console.log(result);
      res.status(200).json(result);
  })
  .catch(err =>{ 
      console.log(err);
      res.status(500).json({ error: err });
  })
});

// Delete request
router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
  Product.remove({_id: id}) 
  .exec()
  .then(result => {
      res.status(200).json(result);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
  })
});

module.exports = router;

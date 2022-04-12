const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/ordersModel');
const Product = require('../models/productModel');

router.get('/', (req, res, next) => {
  Order.find()
  .select('product id quantity')
  .exec()
  .then((results) => {
      res.status(200).json({
          count: results.length,
          orders: results.map(result => {
              return{
                  _id: result._id,
                  product: result.product,
                  quantity: result.quantity,

                  request:{
                      type:'GET',
                      url: "http://localhost:5000/orders/" + result._id
                  }
              }
              
          })
      });
  })
  .catch((err) => {
      res.status(500).json({ error: err})
  })
});


router.post('/', (req, res, next) => {
    // Check if we have a product before we try to save the order
    
    Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
        if(res.statusCode===404){
            return res;
        }
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .exec()
    .then((result) =>{
        res.status(200).json({
            order: result,
            request: {
                type: 'GET',
                url: 'http://localhost:5000/orders'
            }
        })
    })
    .catch((error) =>{
        res.status(500).json(error)
    })
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    Order.remove({ 
        _id: id,
    })
    .exec()
    .then((result) =>{
        res.status(200).json({
            message: 'Record deleted Successfully'
        })
    })
    .catch((error) =>{
        res.status(500).json(error)
    })
});

module.exports = router;
const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/ordersModel');

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
    const order = new Order({
        _id : new mongoose.Types.ObjectId,
        quantity: req.body.quantity,
        product:req.body.productId

    }) 
    order.save()
    .then((result) => {
        res.status(200).json({ 
            message: 'Order created successfully',
            createdOrder : {
               _id: result._id,
                product: result.product,
                quantity: result.quantity
            },

            request: {
                type: "GET",
                url: 'http://localhost:5000/orders/' + result._id
            }
        });
    })
    .catch((err) => {
        res.status(500).json({
            error:err
        })
    })
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .exec()
    .then((result) =>{
        res.status(200).json(result)
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
const Product = require('../models/product');

exports.getProductList = async (req,res) =>{
  try{
      let products = await Product.find();
      res.json({
          success: true,
          products: products
      });
  }catch(err){
      res.status(500).json({
          success: false,
          message: err.message
      });
  }
};

exports.getProductById = async (req, res) => {
  try {
    let product = await Product.findOne({_id: req.params.id});
      res.json({
          success: true,
          product: product
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

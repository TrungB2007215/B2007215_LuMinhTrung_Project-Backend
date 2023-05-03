const Admin = require('../models/admin');
const Product = require('../models/product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = new Admin({
      email,
      password: hashedPassword,
    });
    await admin.save();

    // Create a JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin with the email exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createProduct = async (req, res) => {
  
  try{
    let product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file.path,
      category: req.body.category
    });
    await product.save();
    res.json({
      status: true,
      message: "Successfully created new product",
      data: product,
    });
  }
  catch(err){
      res.status(500).json({
          success: false,
          message: err.message
      });
  }
};

exports.updateProduct = async (req, res) => {
  try{
    let product = await Product.findOneAndUpdate(
      {_id: req.params.id},
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: req.file.path,
          category: req.body.category
        }
      },
      {upsert: true}
    );
    res.json({
        success: true,
        updatedProduct: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

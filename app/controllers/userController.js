const User = require('../models/user');
const Product = require('../models/product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user with the same email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with the same email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


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

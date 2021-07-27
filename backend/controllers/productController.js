import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));

  res.json({ 
    products, 
    page, 
    pages: Math.ceil(count / pageSize) 
  })
})

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found!')
  }
})

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    name: 'Default Name',
    price: 0,
    image: '/images/default.jpg',
    genre: 'Default Genre',
    company: 'Default Company',
    countInStock: 0,
    numReviews: 0,
    description: 'Default text.'
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct)
})

const updateProduct = asyncHandler(async (req, res) => {
  const { 
    name, 
    price,
    image,
    genre,
    company,
    countInStock,    
    description 
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.image = image;
    product.genre = genre;
    product.company = company;
    product.countInStock = countInStock;
    product.description = description;

    const updatedProduct = await product.save();
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found!')
  }
})

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed!'})
  } else {
    res.status(404)
    throw new Error('Product not found!')
  }
})

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed!')
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    if (!review.rating || !review.comment) {
      res.status(400)
      throw new Error('Rating and comment are required to submit a review!')
    } else {
      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save()
      res.status(201).json({ message: 'Review added!' })
    }
  } else {
    res.status(404)
    throw new Error('Product not found!')
  }
})

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products)
})

export {  
  getProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts 
};

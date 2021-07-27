import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [genre, setGenre] = useState('');
  const [company, setCompany] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector(state => state.productUpdate);
  const { 
    loading: loadingUpdate, 
    error: errorUpdate, 
    success: successUpdate 
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push('/admin/productlist')
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setGenre(product.genre)
        setCompany(product.company)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, product, productId, successUpdate, history])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const { data } = await axios.post('/api/uploads', formData, config);

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.log(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateProduct({
      _id: productId,
      name,
      price,
      image,
      genre, 
      company,
      countInStock,
      description
    }))
  }

  return (
    <>
      <Link 
        to='/admin/productlist' 
        className='btn btn-outline-light my-3'
      >
        Go Back
      </Link>
      <Meta title={'Game Master | Admin Product Edit'} />
      <FormContainer>
        <h1 className='text-center'>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && 
        <Message variant='danger'>
          {errorUpdate}
        </Message>
        }
        {loading ? (
          <Loader /> 
        ) : error ? (
          <Message variant='danger'>
            {error}
          </Message> 
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='mb-1'>
              <Form.Label className='text-color-white'>
                Name:
              </Form.Label>
              <Form.Control 
                type='name' 
                placeholder='Set the product name' 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='price' className='mb-1'>
              <Form.Label className='text-color-white'>
                Price:
              </Form.Label>
              <Form.Control 
                type='number' 
                placeholder='Set the product price' 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
              >
              </Form.Control>
            </Form.Group>
  
          <Form.Group controlId='image' className='mb-1'>
            <Form.Label className='text-color-white'>
              Image:
            </Form.Label>
            <Form.Control 
              type='text' 
              placeholder='Set the product image'  
              value={image} 
              onChange={(e) => setImage(e.target.value)}
            >
            </Form.Control>
            <Form.File 
              id='image-file' 
              custom 
              onChange={uploadFileHandler}
            >
            </Form.File>
            {uploading && <Loader />}
          </Form.Group>

          <Form.Group controlId='genre' className='mb-1'>
            <Form.Label className='text-color-white'>
              Genre:
            </Form.Label>
            <Form.Control 
              type='text' 
              placeholder='Set the product genre' 
              value={genre} 
              onChange={(e) => setGenre(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='company' className='mb-1'>
            <Form.Label className='text-color-white'>
              Company:
            </Form.Label>
            <Form.Control 
              type='text' 
              placeholder='Set the game devs name' 
              value={company} 
              onChange={(e) => setCompany(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='countinstock' className='mb-1'>
            <Form.Label className='text-color-white'>
              Count In Stock:
            </Form.Label>
            <Form.Control 
              type='number' 
              placeholder='Set the product count' 
              value={countInStock} 
              onChange={(e) => setCountInStock(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='description' className='mb-1'>
            <Form.Label className='text-color-white'>
              Description:
            </Form.Label>
            <Form.Control 
              as='textarea' 
              rows={6}
              placeholder='Enter your product description' 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

            <Container className='text-center'>
              <Button 
                type='submit' 
                variant='outline-light' 
                className='w-50 my-3 btn-res'
              >
                Update Product
              </Button>
            </Container>
          </Form>
        )}
      </FormContainer>
    </>
  );
}

export default ProductEditScreen;

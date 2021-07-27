import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Form, ListGroup, Card, Image, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { listProductDetails, createProductReview } from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ProductScreen = ({ match, history }) => {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector(state => state.productReviewCreate);
  const { 
    success: successProductReview, 
    loading: loadingProductReview, 
    error: errorProductReview 
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      setComment('')
    }
    if (!product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id))
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
  }, [dispatch, match, successProductReview, product._id])

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?quantity=${quantity}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(match.params.id, {
      rating, 
      comment
    }))
  }

  return (
    <>
      <Link className='btn btn-outline-light my-3' to='/'>
        Go Back
      </Link>
      {loading ? (
        <Loader /> 
      ) : error ? ( 
        <Message variant='danger'>{error}</Message> 
      ) : (
        <>
          <Meta title={`Game Master | ${product.name}`} />
          <Row>
            <Col md={7} lg={6} className='mb-4 mb-lg-0 ms-lg-5'>
              <Image 
                src={product.image} 
                alt={product.name} 
                fluid 
              />
            </Col>
            <Col md={5} lg={4} className='mb-3 mb-sm-4 mb-lg-0'>
              <Card className='border-primary rounded'>
                <ListGroup variant='flush'>
                  <ListGroup.Item className='bg-dark'>
                    <Row>
                      <Col>
                        Price:
                      </Col>
                      <Col>
                        <strong>
                          {product.price} zł
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item className='bg-dark'>
                    <Row>
                      <Col>
                        Status:
                      </Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0 
                            ? 'In Stock' 
                            : 'Out Of Stock'
                          }
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item className='bg-dark'>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                          <Form.Control 
                            as='select' 
                            value={quantity} 
                            onChange={(e) => setQuantity(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(x => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}        

                  <ListGroup.Item className='bg-dark'>
                    <Button
                      type='button'
                      variant='outline-primary'
                      className='w-100' 
                      onClick={addToCartHandler}  
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className='my-3'>
            <Col 
              md={12} 
              className='
                border 
                border-3 
                border-light 
                bg-dark
                remove-border-text'
            >
                <ListGroup variant='flush'>
                  <ListGroup.Item className='bg-dark'>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-dark'>
                    <Rating 
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                      color='#44d9e8' 
                    />
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-dark'>
                    Price: {product.price} zł
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-dark'>
                    Description: 
                    <span 
                      className='my-2' 
                      style={{display: 'block'}}
                    >
                      {product.description}
                    </span>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
          </Row>
          <Row className='my-3'>
            <Col md={12}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && 
                <Message>
                  <span className='text-color-white'>No Reviews Yet.</span>
                </Message>
              }
              <ListGroup variant='flush'>
                {product.reviews.map(review => (
                  <ListGroup.Item 
                    key={review._id} 
                    className='
                      border 
                      border-start-0 
                      border-end-0 
                      border-top-0 
                      border-3 
                      border-light 
                      bg-dark'
                  >
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} color='#44d9e8'/>
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className='bg-dark'>
                  <h2 className='text-color-cyan text-center'>Write Your Review</h2>
                  {successProductReview && (
                    <Message variant='success'>
                      Review submitted successfully
                    </Message>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Message variant='danger'>
                      {errorProductReview}
                    </Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating' className='mb-1'>
                        <Form.Label className='text-color-cyan'>Rating:</Form.Label>
                        <Form.Control 
                          as='select' 
                          value={rating} 
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Terrible</option>
                          <option value='2'>2 - Bad</option>
                          <option value='3'>3 - Solid</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Perfect</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment' className='mb-1'>
                        <Form.Label className='text-color-cyan'>Comment:</Form.Label>
                        <Form.Control 
                          as='textarea' 
                          rows={3} 
                          value={comment} 
                          onChange={(e) => setComment(e.target.value)}
                        >
                        </Form.Control>
                      </Form.Group>
                      <Container className='text-center'>
                        <Button
                          disabled={loadingProductReview}
                          type='submit'
                          variant='outline-light'
                          className='w-25 mt-3 btn-res'
                        >
                          Submit
                        </Button>
                      </Container>
                    </Form>
                  ) : (
                    <Message>
                      Please {' '} 
                      <Link to='/login'>
                        <strong 
                          className='link-hover text-color-white' 
                          style={{textDecoration: 'underline'}}
                        >
                          sign in
                        </strong>
                      </Link> 
                      {' '} to write a review. 
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          </>
        )
      } 
    </>
  );
}

export default ProductScreen;

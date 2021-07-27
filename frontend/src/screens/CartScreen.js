import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;

  const quantity = location.search ? Number(location.search.split('=')[1]) : 1;

  const dispatch = useDispatch();

  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;
  
  useEffect(() => {
    if(productId) {
      dispatch(addToCart(productId, quantity))
    }
  }, [dispatch, productId, quantity])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping')
  }

  return (
    <>
      <Meta title={'Game Master | Cart'} />
      <Row>
        <Col md={7} lg={8}>
          <h1 className='text-color-white'>Shopping Cart</h1>
          {cartItems.length === 0 ? ( 
            <Message variant='info'>Your cart is empty.  
              <Link to='/'>
                {' '}  
                <strong style={{textDecoration: 'underline'}}>
                  Go Back
                </strong>
              </Link>
            </Message> 
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map(item => (
                <ListGroup.Item 
                  key={item.product} 
                  className='
                    border 
                    border-start-0 
                    border-end-0
                    border-top-0 
                    border-3 
                    border-light 
                    bg-dark'
                >
                  <Row>
                    <Col sm={2} className='col-3'>
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fluid 
                        rounded 
                      />
                    </Col>
                    <Col md={3} className='col-5'>
                      <Link 
                        className='
                          text-color-white 
                          link-hover' 
                        to={`/product/${item.product}`}
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col 
                      sm={5} 
                      md={2}
                      className='col-4' 
                    >
                      {item.price} zł
                    </Col>
                    <Col 
                      md={2} 
                      className='
                        col-8
                        my-3 
                        my-sm-2
                        my-lg-0'
                    >
                      <Form.Control 
                        as='select' 
                        value={item.quantity} 
                        onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                      >
                        {[...Array(item.countInStock).keys()].map((i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col 
                      md={2} 
                      className='
                        col-4
                        my-3 
                        my-sm-2
                        my-lg-0'
                    >
                      <Button 
                        type='button' 
                        variant='danger' 
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={5} lg={4} className='mt-3 mt-lg-0'>
          <Card className='border-primary rounded'>
            <ListGroup variant='flush'>
              <ListGroup.Item className='bg-dark'> 
                <h2 className='text-color-cyan'>
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}) items
                </h2>
                {cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)} zł
              </ListGroup.Item>
              <ListGroup.Item className='bg-dark'>
                <Button 
                  type='button' 
                  variant='outline-primary'
                  className='w-100' 
                  disabled={cartItems.length === 0} 
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default CartScreen;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { USER_DETAILS_RESET } from '../constants/userConstants';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector(state => state.cart);

  if (!cart.shippingAddress.address) {
    history.push('/shipping')
  } else if (!cart.paymentMethod) {
    history.push('/payment')
  }

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  }
  
  cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
  cart.shippingPrice = addDecimals(cart.itemsPrice > 200 ? 0 : 20);
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice)).toFixed(2);

  const orderCreate = useSelector(state => state.orderCreate);
  const { success, error, order } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
      dispatch({ type: USER_DETAILS_RESET })
      dispatch({ type: ORDER_CREATE_RESET })
    }
    // eslint-disable-next-line
  }, [dispatch, history, success])

  const placeOrderHandler = () => {
    dispatch(createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      totalPrice: cart.totalPrice
    }))
  }

  return (
    <>
      <Meta title={'Game Master | Place Order'} />
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={7} lg={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item 
              className='
                border 
                border-start-0 
                border-end-0 
                border-top-0 
                border-3 
                border-light 
                bg-dark'
            >
              <h2 className='text-color-cyan'>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {' '}{cart.shippingAddress.address}, 
                {' '}{cart.shippingAddress.city},  
                {' '}{cart.shippingAddress.postalCode}
              </p>
            </ListGroup.Item>

            <ListGroup.Item 
              className='
                border 
                border-start-0 
                border-end-0 
                border-top-0 
                border-3 
                border-light 
                bg-dark'
            >
              <h2 className='text-color-cyan'>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item 
              className='
                border 
                border-start-0 
                border-end-0 
                border-top-0 
                border-3 
                border-light 
                bg-dark'
            >
              <h2 className='text-color-cyan'>Order Items</h2>
              {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty.</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item 
                      key={index} 
                      className='
                        border 
                        border-start-0 
                        border-end-0 
                        border-top-0 
                        border-3 
                        bg-dark'
                    >
                      <Row>
                        <Col lg={1} className='col-2'>
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fluid 
                            rounded 
                          />
                        </Col>
                        <Col lg={7} className='col-5'>
                          <Link 
                            className='text-color-white link-hover' 
                            to={`/product/${item.product}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} className='col-5'>
                          {item.quantity} x {item.price} zł = {item.quantity * item.price} zł
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={5} lg={4} className='mt-3 mt-lg-0'>
          <Card className='border-primary rounded'>
            <ListGroup variant='flush'>
              <ListGroup.Item className='bg-dark'>
                <h2 className='text-color-cyan'>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item className='bg-dark'>
                <Row>
                  <Col>Items</Col>
                  <Col>{cart.itemsPrice} zł</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='bg-dark'>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{cart.shippingPrice} zł</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='bg-dark'>
                <Row>
                  <Col>Total</Col>
                  <Col>{cart.totalPrice} zł</Col>
                </Row>
              </ListGroup.Item>
                <ListGroup.Item className='bg-dark'>
                  {error && 
                    <Message variant='danger'>
                      {error}
                    </Message>
                  }
                </ListGroup.Item>
              <ListGroup.Item className='bg-dark'>
                <Button 
                  type='button'
                  variant='outline-primary' 
                  className='w-100' 
                  disabled={cart.cartItems === 0} 
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>  
    </>
  );
}

export default PlaceOrderScreen;

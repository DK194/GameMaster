import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { getOrderDetails, payOrder, sendOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_SEND_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector(state => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector(state => state.orderPay);
  const { 
    loading: loadingPay, 
    success: successPay 
  } = orderPay;

  const orderSend = useSelector(state => state.orderSend);
  const { 
    loading: loadingSend, 
    success: successSend 
  } = orderSend;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    }
  
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=PLN`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || successPay || successSend || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_SEND_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if(!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch, userInfo, order, orderId, successPay, successSend, history])

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }

  const sendHandler = () => {
    dispatch(sendOrder(order))
  }

  return loading ? (
    <Loader /> 
  ) : error ? (
    <Message variant='danger'>${error}</Message> 
  ) : ( 
    <>
      <Meta title={'Game Master | Order'} />
      <h1 className='order-text'>Order ID: {order._id}</h1>
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
                <strong>Name: </strong> 
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a 
                  className='text-color-white link-hover' 
                  href={`mailto:${order.user.email}`}
                >
                  {order.user.email}
                </a>
              </p>
              <p>
                <strong>Address:</strong>
                {' '}{order.shippingAddress.address}, 
                {' '}{order.shippingAddress.city},  
                {' '}{order.shippingAddress.postalCode}
              </p>
              {order.isSent ? (
                <Message variant='success'>
                  Sent On: {order.sentOn.substring(0, 19).replace('T', ' at ')}.
                </Message> 
                ) : (
                <Message variant='danger'>
                  Not Sent.
                </Message>
                )
              }
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
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  Paid On: {order.paidAt.substring(0, 19).replace('T', ' at ')}.
                </Message> 
                ) : (
                <Message variant='danger'>
                  Not Paid.
                </Message>
                )
              }
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
              {order.orderItems.length === 0 ? (
                <Message>Order is empty.</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
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
        <Col lg={4} md={5} className='mt-3 mt-lg-0'>
          <Card className='border-primary rounded'>
            <ListGroup variant='flush'>
              <ListGroup.Item className='bg-dark'>
                <h2 className='text-color-cyan'>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item className='bg-dark'>
                <Row>
                  <Col>Items:</Col>
                  <Col>{order.itemsPrice} zł</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='bg-dark'>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>{order.shippingPrice} zł</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='bg-dark'>
                <Row>
                  <Col>Total:</Col>
                  <Col>{order.totalPrice} zł</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item className='bg-dark'>
                  {loadingPay && <Loader />}
                  {!sdkReady ? <Loader /> : (
                    <PayPalButton 
                      amount={order.totalPrice}
                      currency='PLN' 
                      onSuccess={successPaymentHandler} 
                    />
                  )}
                </ListGroup.Item>
              )}
              {loadingSend && <Loader />}
              {userInfo && 
                userInfo.isAdmin && 
                order.isPaid && 
                !order.isSent && (
                  <ListGroup.Item className='bg-dark'>
                    <Container className='text-center'>
                      <Button 
                        type='button'
                        variant='outline-primary' 
                        className='
                          btn 
                          btn-block 
                          my-sm-3
                          my-lg-0 
                          btn-res'
                        onClick={sendHandler}
                      >
                        Mark As Sent
                      </Button>
                    </Container> 
                  </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>  
    </>
  )
}

export default OrderScreen;

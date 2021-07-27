import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Col, Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = ({ history }) => {
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <>
      <Meta title={'Game Master | Payment'} />
      <FormContainer>
        <CheckoutSteps step1 step2 step3 /> 
        <h1 className='text-color-cyan'>Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label 
              as='legend' 
              className='text-color-white text-center'
            >
              Choose Your Payment Method:
            </Form.Label>
            <Col>
              <Form.Check 
                type='radio' 
                label='PayPal or Credit Card' 
                id='PayPal' 
                name='paymentMethod' 
                value='PayPal'
                className='text-color-white' 
                onChange={(e) => setPaymentMethod(e.target.value)}
                checked
              >
              </Form.Check>
            </Col>
          </Form.Group>

          <Container className='text-center'>
            <Button 
              type='submit' 
              variant='outline-light'
              className='w-50 mt-3 btn-res' 
            >
              Continue
            </Button>
          </Container>
        </Form>
      </FormContainer>
    </>
  );
}

export default PaymentScreen;

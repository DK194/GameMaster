import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { saveShippingAddress } from '../actions/cartActions';

const ShippingScreen = ({ history }) => {
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ 
      address, 
      city, 
      postalCode 
    }))
    history.push('/payment')
  }

  return (
    <>
      <Meta title={'Game Master | Shipping'} />
      <FormContainer>
        <CheckoutSteps step1 step2 /> 
        <h1 className='text-color-cyan'>Shipping</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='address' className='mb-1'>
            <Form.Label className='text-color-white'>
              Address:
            </Form.Label>
            <Form.Control 
              type='text' 
              placeholder='Enter your address' 
              value={address || ''} 
              onChange={(e) => setAddress(e.target.value)}
              required
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='city' className='mb-1'>
            <Form.Label className='text-color-white'>
              City:
            </Form.Label>
            <Form.Control 
              type='text' 
              placeholder='Enter your city' 
              value={city || ''}  
              onChange={(e) => setCity(e.target.value)}
              required
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='postalCode' className='mb-1'>
            <Form.Label className='text-color-white'>
              Postal Code:
            </Form.Label>
            <Form.Control 
              type='text' 
              placeholder='Enter your postal code' 
              value={postalCode || ''}  
              onChange={(e) => setPostalCode(e.target.value)}
              required
            >
            </Form.Control>
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

export default ShippingScreen;

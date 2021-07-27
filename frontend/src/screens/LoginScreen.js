import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector(state => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if(userInfo) {
      history.push(redirect)
    }
  }, [userInfo, history, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <>
      <Meta title={'Game Master | Login'} />
      <FormContainer>
        <h1 className='text-color-white'>Sign In</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='email' className='mb-1'>
            <Form.Label className='text-color-white'>
              Email
            </Form.Label>
            <Form.Control 
              type='email' 
              placeholder='Enter your email' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='password' className='mb-1'>
            <Form.Label className='text-color-white'>
              Password
            </Form.Label>
            <Form.Control 
              type='password' 
              placeholder='Enter your password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            >
            </Form.Control>
          </Form.Group>

          <Container className='text-center'>
            <Button
              type='submit' 
              variant='outline-light' 
              className='
                w-50 
                mt-3 
                btn-res'
            >
              Sign In
            </Button>
          </Container>

          <Row className='py-3'>
            <Col className='text-color-white'>
              Don't have an account yet? {' '} 
              <Link 
                to={redirect ? 
                  `/register?redirect=${redirect}` : 
                  '/register'
                }> 
                <strong 
                  className='link-hover text-color-white' 
                  style={{textDecoration: 'underline'}}
                >
                  Sign Up
                </strong>
              </Link>
            </Col>
          </Row>
        </Form>
      </FormContainer>
    </>
  );
}

export default LoginScreen;

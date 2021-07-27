import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Form, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { myOrdersList } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector(state => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyList = useSelector(state => state.orderMyList);
  const { 
    loading: loadingOrders, 
    error: errorOrders, 
    orders 
  } = orderMyList;

  useEffect(() => {
    if(!userInfo) {
      history.push('/login')
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
        dispatch(getUserDetails('profile'))
        dispatch(myOrdersList())
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [dispatch, history, userInfo, user, success])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!')
    } else {
      dispatch(updateUserProfile({ 
        id: user._id, 
        name, 
        email, 
        password 
      }))
    }
  }

  return (
    <>
      <Meta title={'Game Master | Profile'} />
      <Row>
        <Col lg={3} md={4} className='bg-dark'>
          <h2 className='text-center'>User Profile</h2>
          {message && <Message variant='danger'>{message}</Message>}
          {}
          {success && <Message variant='success'>Profile Updated!</Message>}
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
                    placeholder='Enter your name' 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                  >
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId='email' className='mb-1'>
                  <Form.Label className='text-color-white'>
                    Email:
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
                    Password:
                  </Form.Label>
                  <Form.Control 
                    type='password' 
                    placeholder='Enter your password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  >
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId='confirmPassword' className='mb-1'>
                  <Form.Label className='text-color-white'>
                    Confirm Password:
                  </Form.Label>
                  <Form.Control 
                    type='password' 
                    placeholder='Confirm password' 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  >
                  </Form.Control>
                </Form.Group>

                <Container className='text-center'>
                  <Button 
                    className='my-3 btn-res' 
                    type='submit' 
                    variant='outline-light'
                  >
                    Update your profile
                  </Button>
                </Container>
              </Form>
            )
          }
        </Col>
        <Col 
          md={8}
          lg={9} 
          className='
            bg-dark 
            border 
            border-bottom-0 
            border-end-0 
            border-top-0 
            border-3 
            border-light
            border-profile-hidden'
        >
          <h2 className='text-center'>My Orders</h2>
          {loadingOrders ? (
            <Loader /> 
          ) : errorOrders ? (
            <Message variant='danger'>
              {errorOrders}
            </Message> 
          ) : (
            <Table 
              striped 
              bordered 
              hover 
              responsive 
              className='table-sm'
            >
              <thead>
                <tr className='text-center'>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>SENT</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className='text-center'>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice} zł</td>
                    <td>
                    {order.isPaid ? 
                      order.paidAt.substring(0, 10) : (
                      <i 
                        className='fas fa-times' 
                        style={{ color: 'red' }}
                      >
                      </i>
                      )
                    }
                    </td>
                    <td>
                    {order.isSent ? 
                      order.sentOn.substring(0, 10) : (
                      <i 
                        className='fas fa-times'
                        style={{ color: 'red' }}
                      >
                      </i>
                      )
                    }
                    </td>
                    <td>
                      <LinkContainer to={`order/${order._id}`}>
                        <Button 
                          className='btn-sm' 
                          variant='info'
                        >
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
}

export default ProfileScreen;

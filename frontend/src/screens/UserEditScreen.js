import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector(state => state.userUpdate);
  const { 
    loading: loadingUpdate, 
    error: errorUpdate, 
    success: successUpdate 
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      history.push('/admin/userlist')
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [dispatch, successUpdate, user, userId, history])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser({ _id: userId, name, email, isAdmin }))
  }

  return (
    <>
      <Link 
        to='/admin/userlist' 
        className='btn btn-outline-light my-3'
      >
        Go Back
      </Link>
      <Meta title={'Game Master | Admin User Edit'} />
      <FormContainer>
        <h1 className='text-center'>Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && 
          <Message varaint='danger'>
            {errorUpdate}
          </Message>}
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

            <Form.Group controlId='isadmin' className='mb-1 my-2'>
              <Form.Check 
                type='checkbox'
                label='Is Admin?' 
                checked={isAdmin} 
                onChange={(e) => setIsAdmin(e.target.checked)}
              >
              </Form.Check>
            </Form.Group>

            <Container className='text-center'>
              <Button 
                type='submit' 
                variant='outline-light'
                className='w-50 mt-3 btn-res' 
              >
                Update
              </Button>
            </Container>
          </Form>
        )}
      </FormContainer>
    </>
  );
}

export default UserEditScreen;

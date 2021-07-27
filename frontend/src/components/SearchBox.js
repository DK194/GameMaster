import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }

  return (
    <Form 
      className='
        d-flex 
        my-2
        my-lg-0' 
      onSubmit={submitHandler}
    >
      <Form.Control 
        type='text' 
        name='q' 
        placeholder='Search for...' 
        className='
          ms-0 
          ms-lg-2 
          me-lg-2
          px-4'
        onChange={(e) => setKeyword(e.target.value)} 
      >
      </Form.Control>
      <Button 
        type='submit' 
        variant='outline-light' 
        className='
          p-2 
          px-3 
          px-sm-5
          px-lg-2 
          ms-2'
      >
        Search
      </Button>
    </Form>
  );
}

export default SearchBox;

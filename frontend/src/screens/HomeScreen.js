import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { listProducts } from '../actions/productActions';

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector(state => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-outline-light'>
          Go Back
        </Link>
      )}
      <h1 
        className='
          text-color-white 
          text-center 
          mt-3'
      >
        Latest Games
      </h1>
      {loading ? ( 
        <Loader /> 
        ) : error ? (
        <Message variant='danger'>{error}</Message> 
        ) : (
          <>
            <Row 
              className='
                justify-content-center 
                justify-content-lg-start'
            >
              {products.map(product => (
                <Col 
                  key={product._id} 
                  sm={10} 
                  md={6} 
                  lg={4} 
                  xl={3} 
                  className='col-11'
                >
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
          </>
        )
      }
    </>
  );
}

export default HomeScreen;

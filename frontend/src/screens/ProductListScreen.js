import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Table, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';
import { 
  listProducts, 
  createProduct, 
  deleteProduct 
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'; 

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector(state => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productCreate = useSelector(state => state.productCreate);
  const { 
    loading: loadingCreate, 
    error: errorCreate, 
    success: successCreate, 
    product: createdProduct 
  } = productCreate;

  const productDelete = useSelector(state => state.productDelete);
  const { 
    loading: loadingDelete, 
    error: errorDelete, 
    success: successDelete 
  } = productDelete;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber))
    }
  }, [dispatch, history, userInfo, successCreate, successDelete, createdProduct, pageNumber])

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id))
    }
  }

  return (
    <>
      <Meta title={'Game Master | Admin Product List'} />
      <Row>
        <Col>
          <h1 className='text-center'>Products</h1>
        </Col>
      </Row>
      <Button 
        className='my-3'
        variant='outline-light' 
        onClick={createProductHandler}
      >
        <i className='fas fa-plus me-1'></i> Create New Product
      </Button>
      {loadingCreate && <Loader />}
      {errorCreate && 
        <Message variant='danger'>
          {errorCreate}
        </Message>
      }
      {loadingDelete && <Loader />}
      {errorDelete && 
        <Message variant='danger'>
          {errorDelete}
        </Message>
      }
      {loading ? (
        <Loader /> 
      ) : error ? (
        <Message variant='danger'>
          {error}
        </Message> 
      ) : (
        <>
          <Table 
            striped 
            bordered 
            hover 
            responsive 
            className='table-sm'
          >
            <thead>
              <tr className='text-center text-color-cyan'>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>GENRE</th>
                <th>COMPANY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className='text-center'>
                  <td>{product._id}</td>  
                  <td>{product.name}</td>
                  <td>{product.price} zł</td>
                  <td>{product.genre}</td>
                  <td>{product.company}</td>  
                  <td className='d-flex'>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button 
                        variant='light' 
                        className='btn-sm me-3 me-lg-2'
                      >
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button 
                      variant='danger' 
                      className='btn-sm' 
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td> 
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}  
    </>
  );
}

export default ProductListScreen;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { listOrders } from '../actions/orderActions';

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderList = useSelector(state => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      history.push('/login')
    }
  }, [dispatch, userInfo, history])

  return (
    <>
      <Meta title={'Game Master | Admin Order List'} />
      <h1>Orders</h1>
      {loading ? (
        <Loader /> 
      ) : error ? (
        <Message variant='danger'>
          {error}
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
            <tr className='text-center text-color-cyan'>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>SENT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className='text-center'>
                <td>{order._id}</td>  
                <td>{order.user && order.user.name}</td>  
                <td>{order.createdAt.substring(0, 10)}</td>  
                <td>{order.totalPrice} zł</td>  
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                    ) : (
                      <i 
                        className='fas fa-times' 
                        style={{color: 'red'}}
                      >
                      </i>
                    )
                  }
                </td>
                <td>
                  {order.isSent ? (
                    order.sentOn.substring(0, 10)
                    ) : (
                      <i 
                        className='fas fa-times' 
                        style={{color: 'red'}}
                      >
                      </i>
                    )
                  }
                </td>  
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button 
                      variant='light' 
                      className='btn-sm'
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
    </>
  );
}

export default OrderListScreen;
